key='WvTDOg2LCl75UMtFZMfkFHedQ1gmFoE5xbRMXDo7'
url='https://7bvfdjodi9.execute-api.us-west-2.amazonaws.com/production/deployment'
dev_key='uIxBcm5TmC6kn0rdZ460L2d4w4E1Rftr9ivZlhvX'
dev_url='https://ehe0omee0l.execute-api.us-west-2.amazonaws.com/development/deployment' 

json='{ "environment": "production", "product": "versioner","product_version": "5","deployer": "sdean","jira_release": "-","caller": "test","state": "done"}'
curl -d "$json" -H 'Content-Type: application/json' -H "x-api-key: $key" $url

echo $url
echo $json


# VUE_APP_API_ENV=production
# VUE_APP_API_KEY=WvTDOg2LCl75UMtFZMfkFHedQ1gmFoE5xbRMXDo7
# VUE_APP_API_URI=https://7bvfdjodi9.execute-api.us-west-2.amazonaws.com
# VUE_APP_API_ENDPOINT=production/deployment/