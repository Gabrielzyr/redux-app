import { all, call, select, takeLatest } from 'redux-saga/effects'
import { addProductToCartRequest } from './actions'
import {IState} from '../../'
import { AxiosResponse } from 'axios';
import api from '../../../services/api';

type CheckProductStockRequest = ReturnType<typeof addProductToCartRequest>

interface IStockResponse {
  id: number;
  quantity: number;
}

function* checkProductStock({payload}: CheckProductStockRequest) {
  const { product } = payload;

  const currentQuantity: number = yield select((state: IState) => {
    return state.cart.items.find(item => item.product.id === product.id)?.quantity ?? 0;
  })

  const availableStockResponse: AxiosResponse<IStockResponse> = yield call(api.get, `stock/${product.id}`)

  if (availableStockResponse.data.quantity > currentQuantity) {
    console.log('deu certo')

  } else {
    console.log('falta de estoque')

  }
}

export default all([
  takeLatest('ADD_PRODUCT_TO_CART_REQUEST', checkProductStock)
])