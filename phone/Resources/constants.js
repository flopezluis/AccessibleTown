function Constants() {
}
Constants.prototype.base_url = 'http://192.168.0.12:8000';

Constants.prototype.api_url = Constants.prototype.base_url + '/api/v0/';
Constants.prototype.SEND_POINT_URL = Constants.prototype.api_url + 'point/add/'; 
Constants = new Constants();

