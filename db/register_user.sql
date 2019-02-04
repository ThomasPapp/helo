insert into account (username, password)
values
($1, $2)
returning *;