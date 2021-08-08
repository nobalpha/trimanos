// TODO split by size
// TODO split by time
// TODO split ui
// TODO split by portion quantity
// TODO type checking
// TODO handle different interval requests

const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
const ffmpeg = createFFmpeg({ log: true });
console.log(ffmpeg);

(async () => {
    const uploader = document.getElementById("uploader");
    const btn_process = document.getElementById("process");
    const player = document.getElementById("player");
    const message = document.getElementById("message");
    const portion = document.getElementById("portion");
    const size = document.getElementById("size");

    const trim = async (e) => {
        const files = uploader.files;
        const file = files[0];
        player.src = await URL.createObjectURL(file);
        player.addEventListener("loadeddata", async (e) => {
            console.log("metadata loaded");

            const duration = player.duration;
            console.log(duration);
            console.log("filesize in bytes", file.size);

            message.innerHTML = "Loading ffmpeg-core.js";
            if (!ffmpeg.isLoaded()) await ffmpeg.load();
            const interpolation_ratio = duration / file.size;
            let ti = 0,
                tf = 0;
            // const inc = file.size / parseInt(portion.value);
            const inc = file.size / parseInt(size.value);
            console.log("inc", inc);
            // for (let i = 1; i <= parseInt(portion.value); i++) {
            for (let i = inc; i <= parseInt(size.value); i += inc) {
                const video = document.createElement("video");
                video.setAttribute("id", `pl${i}`);
                video.setAttribute("controls", "");

                tf = interpolation_ratio * (inc * i);
                console.log("tm", ti, tf);
                message.innerHTML = `Start trimming for id:${i}`;
                ffmpeg.FS("writeFile", file.name, await fetchFile(files[0]));
                await ffmpeg.run(
                    "-i",
                    file.name,
                    "-ss",
                    `${ti}`,
                    "-to",
                    `${tf}`,
                    "-y",
                    "output.mp4"
                );
                message.innerHTML = `Complete trimming for id:${i}`;

                ti = tf;
                const data = ffmpeg.FS("readFile", "output.mp4");

                video.src = URL.createObjectURL(
                    new Blob([data.buffer], { type: "video/mp4" })
                );

                document.body.appendChild(video);
            }
        });
    };

    btn_process.addEventListener("click", trim);

    /*
    
    btn_process.addEventListener("click", (e) => {

        console.log(e.target, uploader.files[0]);
        const file = uploader.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const textContent = e.target.result;

            const data = btoa(textContent);
            const data_url = `data:video/mp4;base64,${data}`;
            const response = await fetch(data_url);
            let blob = await response.blob();
            blob = blob.slice(0, blob.size, "video/mp4");
            const object_url = URL.createObjectURL(blob);
            video.src = object_url;
            // video.play();
        };
        reader.onerror = (e) => {
            const error = e.target.error;
            console.error(error);
        };
        // reader.readAsBinaryString(file);
        reader.readAsBinaryString(file);
    });
    */
})();
