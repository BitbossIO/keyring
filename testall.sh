
test() {
	echo packages/${1}/
	cd packages/${1}/
	# npm i
	npm run test
	cd ../..
}

# filelist=(bsv  cbor-plugin  chain  keyring  msgpack-plugin \
# 	plugin  transaction  txo-plugin  util  validation-plugin)
List=(
	cbor-plugin
	chain
	msgpack-plugin
	plugin
	transaction
	txo-plugin
	util
	validation-plugin
	)

for Item in ${List[*]} ;
  do
    test $Item
  done

echo done! `date`
