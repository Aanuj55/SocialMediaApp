const SocialNetwork = artifacts.require("SocialNetwork");

require('chai')
 .use(require('chai-as-promised'))
 .should()

 contract('SocialNetwork',(/*accounts*/[deployer,author,tipper])=> {         //callback function run just before SocialNetwork run
     let socialNetwork 

     before(async ()=> {
        socialNetwork = await SocialNetwork.deployed()   //by doing it every 'it' function does not require 
     })

     describe('deployment',async ()=> {                 //describe is used to group individual tests. The first parameter should indicate what we’re testing
         it('deploys successfully', async () => {                    //it is used to create the actual tests. The first parameter provide  description of the test. 
           //  socialNetwork = await SocialNetwork.deployed()
             const address = await socialNetwork.address
             assert.notEqual(address, 0x0)
             assert.notEqual(address, '')
             assert.notEqual(address, null)
             assert.notEqual(address, undefined)
         })
         it('smart contract has a name', async ()=> {
             const name = await socialNetwork.name()
             assert.equal(name, "soco")
         })
     })

     describe('posts',async ()=>{
        let result,postCount;
        before(async ()=> {
            result = await socialNetwork.createPost("This is my first post",{from:author})
            postCount = await socialNetwork.postCount()
        })
        it('create post', async () => {                    //it is used to create the actual tests. The first parameter provide  description of the test.
            //successful test criteria
            assert.equal(postCount,1)
            const event = await result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content,'This is my first post','content is correct')
            assert.equal(event.tipAmount,'0','tip amount is correct')
            assert.equal(event.author,author,'author is correct')

            //Failure case 
            await socialNetwork.createPost('',{from: author}).should.be.rejected;

          })
          it('lists posts' , async ()=> {
              const post = await socialNetwork.posts(postCount)
              assert.equal(post.id.toNumber(),postCount.toNumber(),'id is correct')
              assert.equal(post.content,'This is my first post','content is correct')
              assert.equal(post.tipAmount,'0','tip amount is correct')
              assert.equal(post.author,author,'author is correct')
         })

          it('allow users to tip posts', async() => {
            //track author balance before purchase
            let oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
             
            result = await socialNetwork.tipPost(postCount, {from:tipper , value:web3.utils.toWei('1', 'Ether')})

            //Success
            const event = await socialNetwork.posts(postCount)
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content,'This is my first post','content is correct')
            assert.equal(event.tipAmount,'1000000000000000000','tip amount is correct')
            assert.equal(event.author,author,'author is correct')

            //check whether author receive funds
             newAuthorBalance = await web3.eth.getBalance(author)
             newAuthorBalance = new web3.utils.BN(newAuthorBalance)
             
             let tipAmount
             tipAmount = await web3.utils.toWei('1','Ether')
             tipAmount = new web3.utils.BN(tipAmount)

             const expectedBalance = oldAuthorBalance.add(tipAmount)

             assert.equal(newAuthorBalance.toString(),expectedBalance.toString())
          })
     })
 })