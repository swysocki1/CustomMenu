ng build --prod
export AWS_PROFILE=custommenu
aws s3 sync ./dist/CustomMenu/ s3://custommenu --acl public-read --delete
