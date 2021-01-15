const userModel = require('../user.model');
const { ObjectId } = require('mongodb');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'ttdanh282',
    api_key: '244482718551546',
    api_secret: '_MCtZLsUebVjr6sMxAOYld4_lto'
});

//UPDATE USER INFORMATION
exports.putUser = async (user, userEmail, image) => {
    let selectedUser = await userModel.findOne({ email: userEmail});
    await cloudinary.uploader.upload(image,
        {
            folder: "users",
        },
        function (error, result) {
            console.log(result)
            selectedUser.avatar = result.url
            selectedUser.save(function (err) {
                if (err) return handleError(err);
                return "OKE NHA";
            })
        });
}