/*
  Bổ túc kiến thức
  ------------------------------------------------
  Redux-persist là một thư viện cho phép lưu trữ trạng thái của ứng dụng Redux vào localStorage hoặc sessionStorage trong trình duyệt
  Nó giúp cho việc khôi phục trạng thái của ứng dụng sau khi người dùng đóng trình duyệt và mở lại hoặc sau khi làm mới trang web. 
  Thêm vào đó, Redux-persist cũng hỗ trợ việc mã hóa / giải mã dữ liệu để bảo vệ thông tin nhạy cảm.
*/


import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./cartSlice";
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

/*cấu hình persistConfig*/
const persistConfig = {
  key: 'root',
  storage,
}
/*storage là một đối tượng (object) JavaScript được sử dụng để lưu trữ dữ liệu. Trong trường hợp này, đối tượng storage được sử dụng để cấu hình việc lưu trữ dữ liệu của ứng dụng Redux.
Để sử dụng storage trong ứng dụng React/Redux, bạn cần import thư viện redux-persist và tạo ra một đối tượng persistReducer với persistConfig. Đối tượng này sẽ "bọc" reducer gốc của bạn và tạo ra một phiên bản mới của reducer có khả năng lưu trữ dữ liệu. Khi bạn khởi động ứng dụng, dữ liệu của bạn sẽ được load vào store từ storage.
Ngoài ra, storage có thể được cấu hình để sử dụng nhiều loại lưu trữ khác nhau, ví dụ như localStorage hoặc AsyncStorage (trong trường hợp ứng dụng React Native).*/



const persistedReducer = persistReducer(persistConfig, cartReducer)
/*
Đoạn code này dùng để tạo ra một phiên bản mới của reducer ban đầu (ở đây là cartReducer) đã được tích hợp sẵn khả năng lưu trữ dữ liệu.
Cụ thể, chúng ta sử dụng persistReducer từ thư viện redux-persist và truyền vào cho nó 2 tham số:

- persistConfig: đây là một đối tượng cấu hình (configuration object) cho việc lưu trữ dữ liệu, trong đó chúng ta chỉ định tên gọi của key sẽ được sử dụng để lưu trữ trạng thái của store và đối tượng storage (ví dụ như localStorage). Đối tượng persistConfig này có dạng {key: 'root', storage}.
- cartReducer: đây là reducer mà chúng ta muốn bọc lại để có thêm khả năng lưu trữ dữ liệu.

Sau khi sử dụng persistReducer, chúng ta sẽ thu được một phiên bản mới của reducer cartReducer đã được tích hợp khả năng lưu trữ dữ liệu. Phiên bản này có thể được sử dụng để tạo ra store cho ứng dụng Redux.
Nhờ việc này, trạng thái của store sẽ được tự động lưu trữ vào storage (ví dụ localStorage) và được load lại sau khi người dùng tắt ứng dụng và truy cập lại.
*/





export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
/*
Đoạn mã này đang sử dụng thư viện Redux để quản lý trạng thái của ứng dụng. Để tạo một store, chúng ta sử dụng hàm configureStore() và truyền vào các thiết lập cần thiết.

Trong đó:

reducer: Là function reducer (hay state management) được xử lý bằng middleware và có thể được lưu trữ trong local storage thông qua package redux-persist. Ở đây, persistedReducer là một reducer đã được xử lý bằng middleware để lưu trữ trạng thái của ứng dụng.

middleware: Là một hàm nhận vào getDefaultMiddleware là một hàm khởi tạo middleware mặc định của Redux toolkit. Hàm này trả về một danh sách các middleware được cấu hình sẵn để sử dụng cho Redux, bao gồm middleware giúp xử lý các hành động async (thunk), logger, ...

Ở đây, chúng ta muốn kiểm tra xem các hành động có tuân thủ quy tắc serializability hay không. Serializability là một khái niệm rất quan trọng trong phát triển web, nó đảm bảo rằng khi các hành động được gửi đi giữa client và server, chúng sẽ có cùng cơ chế đảm bảo tính nhất quán của dữ liệu, để tránh các lỗi phát sinh trong quá trình giao tiếp giữa client và server.

Để kiểm tra tính nhất quán này, Redux toolkit cung cấp một middleware được gọi là serializableCheck. Middleware này sẽ kiểm tra xem mỗi hành động có tuân thủ quy tắc serializability hay không. Tuy nhiên, không phải tất cả các hành động đều cần phải tuân thủ quy tắc này. Chúng ta có thể thiết lập danh sách các hành động mà middleware này sẽ bỏ qua. Ở đây, danh sách này gồm các hành động: FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE và REGISTER. Điều này cho phép chúng ta loại bỏ các hành động không cần thiết khỏi quá trình kiểm tra, từ đó tăng hiệu suất xử lý của ứng dụng.

Kết quả trả về của configureStore() chính là store đã được tạo ra, và nó có thể được sử dụng trong ứng dụng web để quản lý trạng thái của nó.

-------

FLUSH: Là hành động ghi nhận tất cả các sự thay đổi trạng thái hiện tại và đẩy chúng vào store. Việc này giúp đảm bảo rằng các thay đổi không mất đi khi ứng dụng kết thúc hoặc bị tắt máy tính.
REHYDRATE: Là hành động lấy lại trạng thái đã được lưu trữ từ bộ nhớ đệm hoặc cơ sở dữ liệu và bổ sung cho store. Việc này giúp phục hồi trạng thái của ứng dụng sau khi tắt máy tính hoặc tải lại trang web.
PAUSE: Là hành động tạm dừng việc thực thi action (hành động) để tránh xung đột khi có nhiều action được gọi đồng thời. Khi pause, action mới chỉ được gửi đi khi action trước đã được xử lý xong.
PERSIST: Là hành động lưu trữ trạng thái của ứng dụng vào bộ nhớ đệm hoặc cơ sở dữ liệu để có thể khôi phục lại trạng thái đó khi ứng dụng tắt hoặc bị lỗi.
PURGE: Là hành động xoá bỏ dữ liệu trạng thái được lưu trữ. Việc này được thực hiện khi không cần phục hồi lại trạng thái trước đó và giúp giải phóng bộ nhớ.
REGISTER: Là hành động đăng ký các middleware, reducer hoặc một số plugin vào redux store để mở rộng chức năng của nó.
*/

export const persistor = persistStore(store)

/*

Đoạn code export const persistor = persistStore(store) được sử dụng để tạo ra một đối tượng persistor trong Redux Toolkit.

store: là store của Redux, chứa toàn bộ state và reducer.
persistStore(store): là một hàm từ thư viện redux-persist, được sử dụng để tạo ra một đối tượng persistor. Tham số truyền vào là store của Redux.
Sau khi gọi hàm persistStore(store), nó sẽ trả về một đối tượng persistor. Đối tượng này được gán vào biến persistor thông qua cú pháp export const persistor =. Từ khóa export được sử dụng để xuất biến persistor ra khỏi module hiện tại, để có thể import và sử dụng biến này ở các module khác trong ứng dụng.

Đối tượng persistor lưu trữ các thông tin cần thiết để lưu trữ trạng thái Redux vào bộ nhớ đệm hoặc cơ sở dữ liệu. Khi ứng dụng khởi động, ta có thể sử dụng persistor.persist() để khôi phục lại trạng thái của Redux từ bộ nhớ đệm hoặc cơ sở dữ liệu. Việc này giúp cho ứng dụng có thể tiếp tục từ trạng thái cũ mà không bị mất dữ liệu.

*/ 