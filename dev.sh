npm run serve:back &
SB=$!
npm run serve:front&
SF=$!
wait $SB $SF