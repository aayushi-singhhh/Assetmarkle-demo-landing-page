import * as THREE from "three";
import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.min.js";
import {
    RGBELoader
} from "three/addons/loaders/RGBELoader.min.js";
import {
    MeshoptDecoder
} from "three/addons/libs/meshopt_decoder.module.js";
let mixer, bakedMesh, headMesh, animationAction, isProducts, isTestimonials, isCameraAnimInProgress, featIndex = 0,
    index = 0;
const container = document.querySelector(".webgl"),
    slides = document.querySelectorAll(".js-hero-text-slides .hero-slide"),
    featureSlides = document.querySelectorAll("[hero-feature-slide]"),
    scene = new THREE.Scene,
    gltfLoader = new GLTFLoader,
    frustumSize = 534,
    uvsArray = new Float32Array([1, 1, 0, 1, 0, 0, 1, 0]),
    objectUrl = "https://chaingpt-web.s3.us-east-2.amazonaws.com/assets/3d/chainGPT_robo_COMP_2024.glb",
    envMapUrl = "https://web-assets.chaingpt.org/assets/3d/Cannon_Exterior.hdr",
    buttonClickDelay = 6.5;
gltfLoader.setMeshoptDecoder(MeshoptDecoder);
const spherical = new THREE.Spherical,
    sphericalDelta = new THREE.Spherical,
    rotateStart = new THREE.Vector2,
    rotateEnd = new THREE.Vector2,
    rotateDelta = new THREE.Vector2,
    headInitialRotation = new THREE.Vector3,
    moveThreshold = 30,
    targetVector = new THREE.Vector3(0, 420, 0),
    screens = ["hero", "products"],
    positioning = {
        hero: {
            camera: new THREE.Vector3(462, 740, 612),
            zoom: 1,
            targetVector: new THREE.Vector3(0, 420, 0)
        },
        products: {
            camera: new THREE.Vector3(-38, 560, 612),
            zoom: 1.4,
            targetVector: new THREE.Vector3(0, 570, 0)
        }
    },
    eyeVideo = document.getElementById("eye-video");
eyeVideo.play();
const eyeTexture = new THREE.VideoTexture(eyeVideo);
eyeTexture.minFilter = THREE.LinearFilter, eyeTexture.magFilter = THREE.LinearFilter, eyeTexture.format = THREE.RGBAFormat;
const clickVideo = document.getElementById("click-video"),
    clickTexture = new THREE.VideoTexture(clickVideo);
clickTexture.minFilter = THREE.LinearFilter, clickTexture.magFilter = THREE.LinearFilter, clickTexture.format = THREE.RGBAFormat, clickVideo.onplay = () => {
    setTimeout(changeSlide, 200), setTimeout(changeFeatSlide, 200)
};
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    transparent: !0
});
(new RGBELoader).load(envMapUrl, (e => {
    e.mapping = THREE.EquirectangularReflectionMapping, scene.environment = e
}));
const aspect = window.innerWidth / window.innerHeight,
    camera = new THREE.OrthographicCamera(-534 * aspect, 534 * aspect, 534, -534, 1, 5e3);
camera.position.set(positioning[screens[0]].camera.x, positioning[screens[0]].camera.y, positioning[screens[0]].camera.z), camera.lookAt(positioning[screens[0]].targetVector);
const initialPos = camera.position.clone(),
    initialRot = camera.rotation.clone(),
    light = new THREE.DirectionalLight(16711422, 2);
light.position.set(136, 58, 184), scene.add(light), gltfLoader.load(objectUrl, (e => {
    bakedMesh = e.scene;
    const t = bakedMesh.getObjectByName("FACE");
    headMesh = bakedMesh.getObjectByName("mixamorigHead"), headInitialRotation.copy(headMesh.rotation), t.geometry.setAttribute("uv", new THREE.BufferAttribute(uvsArray, 2)), t.material = shaderMaterial.clone(), t.material.uniforms = {
        videoTexture: {
            type: "sampler2D",
            value: eyeTexture
        }
    };
    const i = bakedMesh.getObjectByName("TOUCH");
    i.geometry.setAttribute("uv", new THREE.BufferAttribute(uvsArray, 2)), i.material = shaderMaterial.clone(), i.material.uniforms = {
        videoTexture: {
            type: "sampler2D",
            value: clickTexture
        }
    }, e.animations.length && (mixer = new THREE.AnimationMixer(e.scene), animationAction = mixer.clipAction(e.animations[0]), animationAction.play()), scene.add(bakedMesh), document.body.classList.add("loaded"), setTimeout((() => {
        document.querySelectorAll("[anim-trigger-hero]").forEach((e => {
            let t = gsap.timeline({
                paused: !0
            });
            t.to(e.querySelector("[anim-trigger-text-hero]"), {
                scrambleText: {
                    chars: "061kzeorqsputf",
                    text: "{original}",
                    speed: 2,
                    delimiter: ""
                },
                duration: .8
            }), ScrollTrigger.create({
                trigger: e,
                start: "top 95%",
                end: "top center",
                onEnter: () => {
                    setTimeout((() => {
                        e.classList.add("is-animated"), t.timeScale(1).play()
                    }), 500)
                }
            })
        }))
    }), 500), document.querySelectorAll("[anim-trigger]").forEach((e => {
        let t = gsap.timeline({
            paused: !0
        });
        t.to(e.querySelector("[anim-trigger-text]"), {
            scrambleText: {
                chars: "061kzeorqsputf",
                text: "{original}",
                speed: 2,
                delimiter: ""
            },
            duration: .8
        }), ScrollTrigger.create({
            trigger: e,
            start: "top 92%",
            onEnter: () => {
                setTimeout((() => {
                    e.classList.add("is-animated"), t.timeScale(1).play()
                }), 300)
            }
        })
    }));
    document.querySelectorAll("[refresh-trigger]").forEach((e => {
        ScrollTrigger.create({
            trigger: e,
            start: "top 90%",
            end: "top center",
            toggleActions: "restart pause resume pause",
            onEnter: () => {
                e.classList.add("is-refreshed"), ScrollTrigger.refresh()
            }
        })
    }))
}));
const renderer = new THREE.WebGLRenderer({
    alpha: !0,
    antialias: !1
});
renderer.setClearColor(16777215, 0), renderer.setPixelRatio(.95 * window.devicePixelRatio), renderer.setSize(window.innerWidth, window.innerHeight), renderer.outputEncoding = THREE.sRGBEncoding, container.appendChild(renderer.domElement);
const clock = new THREE.Clock,
    tick = () => {
        const e = clock.getDelta();
        renderer.render(scene, camera), mixer?.update(e), window.requestAnimationFrame(tick)
    };
eyeVideo.addEventListener("timeupdate", (e => {
    eyeVideo.currentTime >= 2.5 && !isTestimonials && (eyeVideo.currentTime = 0), animationAction && animationAction.time >= 6.5 && animationAction.time <= 7 && clickVideo.play()
}));
const getMouseDegrees = (e, t, i) => {
    let r, a, o, n, s = 0,
        c = 0;
    const d = window.innerWidth,
        l = window.innerHeight;
    return e <= d / 2 && (r = d / 2 - e, a = r / (d / 2) * 100, s = i * a / 100 * -1), e >= d / 2 && (r = e - d / 2, a = r / (d / 2) * 100, s = i * a / 100), t <= l / 2 && (o = l / 2 - t, n = o / (l / 2) * 100, c = .5 * i * n / 100 * -1), t >= l / 2 && (o = t - l / 2, n = o / (l / 2) * 100, c = i * n / 100), {
        x: s,
        y: c
    }
};
gsap.registerPlugin(ScrollTrigger), ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "95%",
    onLeaveBack: () => {
        animationAction?.play()
    },
    onUpdate: e => {
        cameraAnimation(e.progress)
    }
}), ScrollTrigger.create({
    trigger: ".unlimited-solutions",
    start: "top 10%",
    end: "95%",
    onEnter: () => {
        isProducts = !0, animationAction?.stop()
    },
    onLeaveBack: () => {
        isProducts = !1, headMesh && gsap.to(headMesh.rotation, {
            x: headInitialRotation.x,
            y: headInitialRotation.y,
            duration: .1,
            delay: .01
        })
    }
});
const changeSlide = () => {
    index = index > slides.length - 2 ? 0 : index, slides.forEach(((e, t) => {
        console.log("index: " + index), index === t ? e.classList.add("active") : e.classList.remove("active");
        const lineWrapper = document.querySelector('.hero-info-line-wrapper');
        if(lineWrapper) {
            lineWrapper.classList.remove('start-animation');
            void lineWrapper.offsetWidth;
            lineWrapper.classList.add('start-animation');
        }
    })), index++
};
changeSlide();
const changeFeatSlide = () => {
    featIndex = featIndex > featureSlides.length - 1 ? 0 : featIndex, featureSlides.forEach(((e, t) => {
        featIndex === t ? e.classList.add("active") : e.classList.remove("active")
    })), featIndex++
};
changeFeatSlide();
const cameraAnimation = e => {
        if (isCameraAnimInProgress) return;
        const t = positioning[screens[0]].targetVector.y + e * (positioning[screens[1]].targetVector.y - positioning[screens[0]].targetVector.y);
        gsap.to(camera, {
            zoom: positioning[screens[0]].zoom + e * (positioning[screens[1]].zoom - positioning[screens[0]].zoom)
        }), gsap.to(camera.position, {
            x: positioning[screens[0]].camera.x + e * (positioning[screens[1]].camera.x - positioning[screens[0]].camera.x),
            y: positioning[screens[0]].camera.y + e * (positioning[screens[1]].camera.y - positioning[screens[0]].camera.y),
            z: positioning[screens[0]].camera.z + e * (positioning[screens[1]].camera.z - positioning[screens[0]].camera.z),
            onUpdate: () => {
                targetVector.set(0, t, 0), camera.lookAt(targetVector), camera.updateProjectionMatrix()
            },
            onComplete: () => {
                initialPos.copy(camera.position), initialRot.copy(camera.rotation), eyeVideo.currentTime = 2.5, isCameraAnimInProgress = !1
            }
        }), animationAction?.setEffectiveWeight(1 - e)
    },
    updatePointsData = () => {
        const e = new THREE.Vector3,
            t = (new THREE.Quaternion).setFromUnitVectors(camera.up, new THREE.Vector3(0, 1, 0)),
            i = t.clone().invert(),
            r = camera.position;
        e.copy(r).sub(targetVector), e.applyQuaternion(t), spherical.setFromVector3(e), spherical.theta += sphericalDelta.theta, spherical.phi += sphericalDelta.phi, spherical.makeSafe(), e.setFromSpherical(spherical), e.applyQuaternion(i), r.copy(targetVector).add(e), camera.lookAt(targetVector)
    };
["mouseleave", "mouseenter"].forEach((e => document.body.addEventListener(e, (() => {
    bakedMesh && (gsap.to(camera.position, {
        x: initialPos.x,
        y: initialPos.y,
        z: initialPos.z,
        duration: .1,
        delay: .01
    }), gsap.to(camera.rotation, {
        x: initialRot.x,
        y: initialRot.y,
        z: initialRot.z,
        duration: .1,
        delay: .01
    }), rotateDelta.set(0, 0, 0)), headMesh && isProducts && gsap.to(headMesh.rotation, {
        x: headInitialRotation.x,
        y: headInitialRotation.y,
        duration: .1,
        delay: .01
    })
})))), document.addEventListener("mousemove", (e => {
    if (rotateEnd.set(e.clientX, e.clientY), rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(.05), rotateStart.copy(rotateEnd), !(!bakedMesh || Math.abs(rotateDelta.x) > 30 || Math.abs(rotateDelta.y) > 30 || isCameraAnimInProgress)) {
        if (gsap.to(sphericalDelta, {
            theta: 2 * Math.PI * -rotateDelta.x / renderer.domElement.clientHeight,
            duration: .1,
            onComplete: () => {
                sphericalDelta.set(0, 0, 0)
            }
        }), gsap.to(sphericalDelta, {
            phi: 2 * Math.PI * -rotateDelta.y / renderer.domElement.clientHeight,
            duration: .1,
            onComplete: () => {
                sphericalDelta.set(0, 0, 0)
            }
        }), isProducts) {
            const t = getMouseDegrees(e.clientX, e.clientY, 10);
            gsap.to(headMesh.rotation, {
                x: 1.5 * THREE.MathUtils.degToRad(t.y),
                y: 1.5 * THREE.MathUtils.degToRad(t.x),
                duration: .1
            })
        }
        updateEyesPos(e), updatePointsData()
    }
}));
const updateEyesPos = e => {
    const t = document.querySelector(".pupils"),
        i = t.getBoundingClientRect();
    if (i.top > window.innerHeight) return;
    const r = (e.clientX - i.left) / 40 + "px",
        a = (e.clientY - i.top) / 15 + "px";
    t.style.transform = "translate3d(" + r + "," + a + ", 0px)"
};
window.addEventListener("resize", (() => {
    const e = window.innerWidth / window.innerHeight;
    camera.left = -534 * e, camera.right = 534 * e, camera.top = 534, camera.bottom = -534, camera.updateProjectionMatrix(), renderer.setSize(window.innerWidth, window.innerHeight), renderer.setPixelRatio(window.devicePixelRatio)
})), tick();

