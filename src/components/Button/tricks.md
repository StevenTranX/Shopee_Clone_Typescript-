## Hạn chế việc spam submit button của user để tránh việc gọi api quá nhiều như thế nào ?

`Viết 1 Custom Button, trong đó có sử dụng loading, chỉ cần truyền disabled = {isLoading}`

>> Thì nếu như đang loading để gửi data lên server, lúc này loading = true, thì sẽ bị disabled