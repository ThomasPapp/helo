select post.title, post.content, account.username
from
post
join on post.user_id = account.account_id
where account.account_id = $1;