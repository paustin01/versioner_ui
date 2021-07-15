
url='https://ehe0omee0l.execute-api.us-west-2.amazonaws.com/development/deployment' 
json='{ "environment": "production", "product": "versioner","product_version": "4","deployer": "sdean","jira_release": "-","caller": "test","state": "done"}'
curl -d "$json" -H 'Content-Type: application/json' -H 'x-api-key: uIxBcm5TmC6kn0rdZ460L2d4w4E1Rftr9ivZlhvX' $url

echo $url
echo $json