const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
  })

describe('favorite blog', () => {
    const listWithTwoBlogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f9',
          title: 'React patterns',
          author: 'partner',
          url: 'https://google.it',
          likes: 12,
          __v: 0}
      ]
    const rightResult =  {
        _id: '5a422aa71b54a676234d17f9',
        title: 'React patterns',
        author: 'partner',
        url: 'https://google.it',
        likes: 12,
        __v: 0}
      test('when list has two blogs, equals the likes of the most liked one', () => {
        const result = listHelper.favoriteBlog(listWithTwoBlogs)
        assert.deepStrictEqual(result, rightResult)
      })

})

