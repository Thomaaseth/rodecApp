// deploy/01_deploy_donate.js
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();


    await deploy("Donate", {
        from: deployer,
        args: [],
        log: true,
    });

    // console.log(`Donate deployed to ${donate.address}`);
};
module.exports.tags = ['Donate'];
