import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'

//异步
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

//向外暴漏store对象
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))
