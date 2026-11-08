var d = document,
    $ = function(s, r) {
        return (r || d).querySelector(s)
    },
    $$ = function(s, r) {
        return [].slice.call((r || d).querySelectorAll(s))
    };
d.documentElement.classList.add("js");
/* images: loads a file only if it exists, so the page works before photos are added */
$$("[data-img]").forEach(function(e) {
    var i = new Image();
    i.onload = function() {
        e.style.backgroundImage = "url(" + e.dataset.img + ")";
        e.classList.add("has")
    };
    i.src = e.dataset.img
});
/* hero slideshow */
var slides = $$(".slide"),
    si = 0,
    tm;
slides.forEach(function(_, k) {
    var b = d.createElement("button");
    b.setAttribute("aria-label", "Slide " + (k + 1));
    b.onclick = function() {
        go(k);
        auto()
    };
    $("#dots").appendChild(b)
});

function go(i) {
    si = i;
    slides.forEach(function(s, k) {
        s.classList.toggle("on", k == i)
    });
    $$("#dots button").forEach(function(b, k) {
        b.classList.toggle("on", k == i)
    })
}

function auto() {
    clearInterval(tm);
    tm = setInterval(function() {
        go((si + 1) % slides.length)
    }, 5500)
}
/* why choose us: scroll-driven + arrows */
var why = [
        ["Comprehensive Clinical Training", "The program combines classroom instruction with supervised clinical training, equipping students with the practical skills required to practice in a healthcare setting."],
        ["Experienced and Dedicated Mentors", "Students are guided by professional and caring mentors who provide sound instruction, steady support, and the guidance needed to develop confidence and competence in the field."],
        ["A Commendable Licensure Examination Passing Rate", "97% of our graduates passed the licensure examination, reflecting the quality of preparation the program provides."],
        ["A Supportive Learning Community", "The School of Radiologic Technology fosters a welcoming and cooperative environment in which students are encouraged to learn, collaborate, and grow together."],
        ["Compassionate, Ethical, and Current Practice", "Our education is grounded in compassionate care and ethical practice, and is informed by the latest medical advancements, preparing graduates to become competent and caring healthcare professionals."]
    ],
    wi = 0,
    ww = $("#whyw");
why.forEach(function(w, k) {
    var el = d.createElement("div");
    el.className = "wi";
    el.innerHTML = "<h3></h3><p></p>";
    $("h3", el).innerHTML = w[0].split(" ").map(function(x, k) {
        return "<span class='w'><span style='--i:" + k + "'>" + x + "</span></span> "
    }).join("");
    $("p", el).textContent = w[1];
    $("#whyb").appendChild(el);
    var s = d.createElement("span");
    s.textContent = "0" + (k + 1);
    $("#nrow").appendChild(s)
});

function showWhy(i) {
    wi = Math.max(0, Math.min(why.length - 1, i));
    $$(".wi").forEach(function(e, k) {
        e.className = "wi" + (k == wi ? " on" : k < wi ? " l" : " r")
    });
    $("#nrow").style.transform = "translateY(calc(-1.15em * " + wi + "))";
    var wn = $(".wnum");
    if (wn) {
        wn.classList.remove("go");
        void wn.offsetWidth;
        wn.classList.add("go")
    }
}

function whyGo(i) {
    showWhy((i + why.length) % why.length)
}

function whyScroll() {
    var r = ww.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    var t = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * .6)));
    t = t * t * (3 - 2 * t);
    $(".why").style.setProperty("--c", (46 * (1 - t)).toFixed(2))
}
$("#wp").onclick = function() {
    whyGo(wi - 1)
};
$("#wx").onclick = function() {
    whyGo(wi + 1)
};
addEventListener("scroll", whyScroll, {
    passive: true
});
addEventListener("resize", whyScroll);
whyScroll();
/* tabs */
$$("[data-tabs]").forEach(function(g) {
    g.onclick = function(e) {
        var t = e.target.dataset.t;
        if (!t) return;
        $$("button", g).forEach(function(b) {
            b.classList.toggle("on", b === e.target)
        });
        $$(".pane", g.closest(".page")).forEach(function(p) {
            p.classList.toggle("on", t == "all" || p.id == t)
        })
    }
});
/* accordions */
$$(".acc>button").forEach(function(b) {
    b.onclick = function() {
        b.parentNode.classList.toggle("open")
    }
});
/* calendar: October 2026 starts on a Thursday */
var cal = $("#cal"),
    h = "";
["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(function(x) {
    h += "<span class='h'>" + x + "</span>"
});
for (var i = 0; i < 4; i++) h += "<span></span>";
for (var n = 1; n <= 31; n++) h += "<span" + (n == 26 ? " class='t'" : "") + ">" + n + "</span>";
if (cal) cal.innerHTML = h;
/* form */
$("#f").onsubmit = function(e) {
    e.preventDefault();

    var form = this;
    var button = form.querySelector("button[type='submit']");

    button.disabled = true;
    button.textContent = "Sending...";

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form)
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            $("#ok").classList.add("show");
            form.reset();

            setTimeout(function() {
                $("#ok").classList.remove("show");
            }, 5000);
        } else {
            alert("Unable to send your message. Please try again.");
        }
    })
    .catch(function(error) {
        alert("Something went wrong. Please try again.");
    })
    .finally(function() {
        button.disabled = false;
        button.textContent = "Send";
    });
};
/* menu */
var nav = $("#nav"),
    bg = $("#burger"),
    hd = $("header");
bg.onclick = function() {
    var o = nav.classList.toggle("open");
    bg.setAttribute("aria-expanded", o)
};
$(".dd .top").onclick = function() {
    this.parentNode.classList.toggle("open")
};
addEventListener("scroll", function() {
    hd.classList.toggle("sc", scrollY > 20)
}, {
    passive: true
});
/* scroll reveal (staggered) */
var io = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (e.isIntersecting) {
            var t = e.target;
            t.classList.add("in");
            io.unobserve(t);
            setTimeout(function() {
                if (t.classList.contains("wsplit")) {
                    t.classList.remove("rv")
                } else {
                    t.classList.remove("rv", "in")
                }
                t.style.transitionDelay = ""
            }, 1100)
        }
    })
}, {
    threshold: .12
});
$$(".card,.pr,.blk h2,.acc,.row,.tl li,.split,.cta .wrap").forEach(function(e) {
    e.classList.add("rv");
    e.style.transitionDelay = Math.min([].indexOf.call(e.parentNode.children, e), 5) * 90 + "ms";
    io.observe(e)
});
/* page routing with fade */
var names = ["home", "about", "academics", "enrollment", "scholarship", "faqs", "news", "contact", "n-sportsfest", "n-acquaintance", "n-whitecoat", "n-awards", "n-leadership", "n-arawngwika", "n-imbukada"];

function route() {
    var p = (location.hash || "#home").slice(1);
    if (names.indexOf(p) < 0) p = "home";
    var q = p.indexOf("n-") == 0 ? "article" : p;
    if (q == "article" && window.showArt) showArt(p.slice(2));
    $$(".page").forEach(function(x) {
        x.classList.toggle("on", x.id == "p-" + q)
    });
    $$("nav a").forEach(function(a) {
        a.classList.toggle("on", a.getAttribute("href") == "#" + (q == "article" ? "news" : p))
    });
    nav.classList.remove("open");
    bg.setAttribute("aria-expanded", "false");
    scrollTo({
        top: 0,
        behavior: "instant"
    })
}
addEventListener("hashchange", route);
route();
go(0);
showWhy(0);
auto();

/* announcement bar */
$("#ann button").onclick = function() {
    $("#ann").classList.add("closed")
};
/* header hides on scroll down, returns on scroll up; progress bar; hero parallax */
var ly = 0,
    pg = $("#pg"),
    hero = $(".hero");
addEventListener("scroll", function() {
    var y = scrollY;
    if (!nav.classList.contains("open")) hd.classList.toggle("hide", y > ly && y > 220);
    ly = y;
    pg.style.transform = "scaleX(" + (y / Math.max(1, d.body.scrollHeight - innerHeight)) + ")";
    if (y < 900) hero.style.setProperty("--py", y * .22)
}, {
    passive: true
});
/* mobile menu: slide-in panel */
$$("nav>ul>li").forEach(function(l, k) {
    l.style.setProperty("--i", k)
});
bg.onclick = function() {
    var o = nav.classList.toggle("open");
    d.body.classList.toggle("menu", o);
    hd.classList.remove("hide");
    bg.textContent = o ? "✕" : "☰";
    bg.setAttribute("aria-expanded", o)
};
d.addEventListener("click", function(e) {
    if (d.body.classList.contains("menu") && !e.target.closest("nav,#burger")) {
        nav.classList.remove("open");
        d.body.classList.remove("menu");
        bg.textContent = "☰"
    }
});
/* sliding tab underline */
function ind() {
    $$("[data-tabs]").forEach(function(g) {
        var i = $(".ind", g);
        if (!i) {
            i = d.createElement("span");
            i.className = "ind";
            g.appendChild(i)
        }
        var b = $("button.on", g);
        if (b && b.offsetWidth) {
            i.style.left = b.offsetLeft + "px";
            i.style.width = b.offsetWidth + "px"
        }
    })
}
$$("[data-tabs]").forEach(function(g) {
    g.addEventListener("click", function() {
        setTimeout(ind, 0)
    })
});
addEventListener("hashchange", function() {
    setTimeout(ind, 60)
});
addEventListener("resize", ind);
ind();
/* curtain wipe between pages */
var cv = $("#cv"),
    busy = 0;
d.addEventListener("click", function(e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var p = a.getAttribute("href").slice(1);
    if (names.indexOf(p) < 0) return;
    e.preventDefault();
    if (busy || p == (location.hash || "#home").slice(1)) return;
    busy = 1;
    nav.classList.remove("open");
    d.body.classList.remove("menu");
    bg.textContent = "☰";
    cv.className = "in";
    setTimeout(function() {
        location.hash = p;
        hd.classList.remove("hide");
        cv.className = "out";
        setTimeout(function() {
            cv.style.transition = "none";
            cv.className = "";
            void cv.offsetWidth;
            cv.style.transition = "";
            busy = 0
        }, 560)
    }, 480)
});

/* slider buttons, swipe, pause while interacting, auto-slide when idle */
function step(n) {
    go((si + n + slides.length) % slides.length);
    auto()
}
$(".prev").onclick = function() {
    step(-1)
};
$(".next").onclick = function() {
    step(1)
};
hero.addEventListener("mouseenter", function() {
    clearInterval(tm)
});
hero.addEventListener("mouseleave", auto);
var sx = 0;
hero.addEventListener("touchstart", function(e) {
    sx = e.touches[0].clientX;
    clearInterval(tm)
}, {
    passive: true
});
hero.addEventListener("touchend", function(e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    else auto()
}, {
    passive: true
});

/* FAQ ask-a-question box */

$("#ask").onsubmit = function(e) {
    e.preventDefault();

    var form = this;
    var button = form.querySelector("button[type='submit']");

    button.disabled = true;
    button.textContent = "Sending...";

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form)
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            $("#ok2").classList.add("show");
            form.reset();

            setTimeout(function() {
                $("#ok2").classList.remove("show");
            }, 5000);
        } else {
            alert("Unable to send your question. Please try again.");
        }
    })
    .catch(function(error) {
        alert("Something went wrong. Please try again.");
    })
    .finally(function() {
        button.disabled = false;
        button.textContent = "Send";
    });
};

/* back to top */
var tp = $("#top");
addEventListener("scroll", function() {
    tp.classList.toggle("show", scrollY > 400)
}, {
    passive: true
});
tp.onclick = function() {
    scrollTo({
        top: 0,
        behavior: "smooth"
    })
};

/* growing lines, image reveals, background parallax */
$$(".prow img,.split>.ph").forEach(function(e) {
    e.classList.add("imgr")
});
var io2 = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (e.isIntersecting) {
            $$(".imgr,.gl", e.target).forEach(function(x) {
                x.classList.add("in")
            });
            io2.unobserve(e.target)
        }
    })
}, {
    threshold: .1
});
var seen = [];
$$(".imgr,.gl").forEach(function(e) {
    var p = e.parentNode;
    if (seen.indexOf(p) < 0) {
        seen.push(p);
        io2.observe(p)
    }
});
setTimeout(function() {
    $$(".imgr,.gl").forEach(function(x) {
        if (x.getBoundingClientRect().top < innerHeight) x.classList.add("in")
    })
}, 2500);
var px = $$(".why,.cta");
addEventListener("scroll", function() {
    px.forEach(function(e) {
        var r = e.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) e.style.setProperty("--py2", -(r.top + r.height / 2 - innerHeight / 2) * .12)
    })
}, {
    passive: true
});

/* count-up numbers when they scroll into view */
$$("b.big").forEach(function(e) {
    var t = e.textContent;
    e.dataset.v = parseFloat(t);
    e.dataset.d = (t.split(".")[1] || "").replace("%", "").length;
    e.dataset.t = t;
    e.textContent = "0%"
});
var io3 = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting) return;
        io3.unobserve(e.target);
        var el = e.target,
            v = +el.dataset.v,
            dc = +el.dataset.d,
            t0 = performance.now();
        (function f(n) {
            var k = Math.min(1, (n - t0) / 1500),
                q = 1 - Math.pow(1 - k, 3);
            el.textContent = (v * q).toFixed(dc) + "%";
            if (k < 1) requestAnimationFrame(f);
            else el.textContent = el.dataset.t
        })(t0)
    })
}, {
    threshold: .5
});
$$("b.big").forEach(function(e) {
    io3.observe(e)
});
setTimeout(function() {
    $$("b.big").forEach(function(e) {
        if (e.textContent == "0%" && e.getBoundingClientRect().top < innerHeight) e.textContent = e.dataset.t
    })
}, 4000);

/* words rise into view (Passing Rate + headings) */
(function() {
    var n, t = $$(".it,.yr,.pr i,.pr p");
    if (!t.length || matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    function sp(node) {
        [].slice.call(node.childNodes).forEach(function(c) {
            if (c.nodeType == 3) {
                var f = d.createDocumentFragment();
                c.textContent.split(/(\s+)/).forEach(function(w) {
                    if (!w) return;
                    if (/^\s+$/.test(w)) {
                        f.appendChild(d.createTextNode(" "));
                        return
                    }
                    var o = d.createElement("span"),
                        s = d.createElement("span");
                    o.className = "wd";
                    s.textContent = w;
                    s.style.setProperty("--i", n++);
                    o.appendChild(s);
                    f.appendChild(o)
                });
                c.parentNode.replaceChild(f, c)
            } else if (c.nodeType == 1) sp(c)
        })
    }
    t.forEach(function(e) {
        n = 0;
        sp(e);
        e.classList.add("wsplit")
    });
    var io4 = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (e.isIntersecting) {
                e.target.classList.add("in");
                io4.unobserve(e.target)
            }
        })
    }, {
        threshold: .2
    });
    t.forEach(function(e) {
        io4.observe(e)
    });
    setTimeout(function() {
        t.forEach(function(e) {
            if (e.getBoundingClientRect().top < innerHeight * .9) e.classList.add("in")
        })
    }, 2500)
})();

/* ===== About Us: sticky History / Faculty tabs with scroll-spy, sliding underline, staged reveals ===== */
(function() {
    var ap = $("#p-about");
    if (!ap) return;
    var tabs = $("#abtabs"),
        btns = $$("button", tabs),
        ind = $(".abind", tabs),
        cur = $("#abcur"),
        secs = btns.map(function(b) {
            return $("#" + b.dataset.go)
        }),
        act = -1,
        lock = 0,
        tick = 0,
        calm = matchMedia("(prefers-reduced-motion:reduce)").matches;

    function place() {
        var b = btns[Math.max(act, 0)];
        if (b && b.offsetWidth) {
            ind.style.left = b.offsetLeft + "px";
            ind.style.width = b.offsetWidth + "px"
        }
    }

    function setAct(k) {
        if (k === act) return;
        var first = act < 0;
        act = k;
        btns.forEach(function(b, i) {
            b.classList.toggle("on", i === k);
            b.setAttribute("aria-current", i === k ? "true" : "false")
        });
        place();
        var t = btns[k].textContent;
        if (first || cur.textContent === t) {
            cur.textContent = t;
            return
        }
        cur.classList.add("sw");
        setTimeout(function() {
            cur.textContent = t;
            cur.classList.remove("sw")
        }, 220)
    }

    function spy() {
        tick = 0;
        if (!ap.classList.contains("on") || Date.now() < lock) return;
        var line = innerHeight * .38,
            k = 0;
        secs.forEach(function(s, i) {
            if (s.getBoundingClientRect().top <= line) k = i
        });
        if (innerHeight + scrollY >= d.documentElement.scrollHeight - 6) k = secs.length - 1;
        setAct(k)
    }
    addEventListener("scroll", function() {
        if (!tick) tick = requestAnimationFrame(spy)
    }, {
        passive: true
    });
    tabs.addEventListener("click", function(e) {
        var b = e.target.closest("button");
        if (!b) return;
        var k = btns.indexOf(b);
        setAct(k);
        lock = Date.now() + 1100;
        secs[k].scrollIntoView({
            behavior: calm ? "auto" : "smooth",
            block: "start"
        })
    });
    /* staged reveals: children of [data-stag] fade up one after another */
    $$("[data-stag]", ap).forEach(function(g) {
        [].forEach.call(g.children, function(c, i) {
            c.setAttribute("data-rv", "");
            c.style.setProperty("--d", Math.min(i, 5))
        })
    });
    var els = $$("[data-rv],[data-grow]", ap);
    var io = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (!e.isIntersecting) return;
            var t = e.target;
            t.classList.add("in");
            io.unobserve(t);
            setTimeout(function() {
                t.classList.add("done")
            }, 1600)
        })
    }, {
        threshold: .18,
        rootMargin: "0px 0px -4% 0px"
    });
    els.forEach(function(e) {
        io.observe(e)
    });
    /* leaving the page resets everything so the entrance plays again next time */
    addEventListener("hashchange", function() {
        if (ap.classList.contains("on")) {
            setTimeout(function() {
                act = -1;
                setAct(0)
            }, 60)
        } else {
            els.forEach(function(e) {
                e.classList.remove("in", "done");
                io.observe(e)
            })
        }
    });
    addEventListener("resize", place);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(place);
    setAct(0);
    setTimeout(place, 120);
})();

/* ===== Admissions pages: staged reveals, sliding category pills with animated height ===== */
(function() {
    var pages = $$("#p-enrollment,#p-scholarship,#p-faqs,#p-contact,#p-academics");
    if (!pages.length) return;
    var all = [],
        io = new IntersectionObserver(function(es) {
            es.forEach(function(e) {
                if (!e.isIntersecting) return;
                var t = e.target;
                t.classList.add("in");
                io.unobserve(t);
                setTimeout(function() {
                    t.classList.add("done")
                }, 1600)
            })
        }, {
            threshold: .15,
            rootMargin: "0px 0px -4% 0px"
        });

    function rearm(e) {
        e.classList.remove("in", "done");
        io.observe(e)
    }
    pages.forEach(function(ap) {
        $$("[data-stag]", ap).forEach(function(g) {
            [].forEach.call(g.children, function(c, i) {
                c.setAttribute("data-rv", "");
                c.style.setProperty("--d", Math.min(i, 5))
            })
        });
        $$("[data-rv],[data-grow]", ap).forEach(function(e) {
            all.push(e);
            io.observe(e)
        })
    });
    /* sliding pills + animated panel height (works for every .pills + .rq pair) */
    function initPills(pills, rq) {
        if (!pills || !rq) return;
        var pb = $$("button", pills),
            bg = $(".pillbg", pills);

        function place() {
            var b = $("button.on", pills);
            if (b && b.offsetWidth) {
                bg.style.left = b.offsetLeft + "px";
                bg.style.width = b.offsetWidth + "px"
            }
        }
        pills.addEventListener("click", function(e) {
            var b = e.target.closest("button");
            if (!b || b.classList.contains("on")) return;
            var nx = $("#" + b.dataset.p),
                cur = $(".rqp.on", rq);
            if (!nx || nx === cur) return;
            pb.forEach(function(x) {
                x.classList.toggle("on", x === b);
                x.setAttribute("aria-selected", x === b)
            });
            place();
            var h0 = rq.offsetHeight;
            rq.style.height = h0 + "px";
            rq.classList.add("tr");
            cur.classList.remove("on");
            nx.classList.add("on");
            $$("[data-rv]", nx).forEach(rearm);
            var h1 = nx.offsetHeight;
            requestAnimationFrame(function() {
                rq.style.height = h1 + "px"
            });
            setTimeout(function() {
                rq.style.height = "";
                rq.classList.remove("tr")
            }, 650)
        });
        addEventListener("resize", place);
        if (d.fonts && d.fonts.ready) d.fonts.ready.then(place);
        addEventListener("hashchange", function() {
            setTimeout(place, 80)
        });
        setTimeout(place, 150);
        place()
    }
    initPills($("#pills"), $("#rq"));
    initPills($("#ypills"), $("#yq"));
    /* leaving a page resets it so the entrance plays again next visit */
    addEventListener("hashchange", function() {
        pages.forEach(function(ap) {
            if (!ap.classList.contains("on")) $$("[data-rv],[data-grow]", ap).forEach(rearm)
        })
    });
})();

/* ===== Admissions on phones: requirement accordions (one open at a time) + collapsible scholarship sections ===== */
(function() {
    var mob = matchMedia("(max-width:700px)");
    d.addEventListener("click", function(e) {
        if (!mob.matches) return;
        var b = e.target.closest(".rch");
        if (b) {
            var rc = b.closest(".rc"),
                open = !rc.classList.contains("open");
            if (open) $$(".rc.open", rc.parentNode).forEach(function(o) {
                if (o !== rc) {
                    o.classList.remove("open");
                    $(".rch", o).setAttribute("aria-expanded", "false")
                }
            });
            rc.classList.toggle("open", open);
            b.setAttribute("aria-expanded", open);
            return
        }
        var sh = e.target.closest(".sh");
        if (sh) {
            var s = sh.closest(".col"),
                o = !s.classList.contains("open");
            s.classList.toggle("open", o);
            $(".tg", s).setAttribute("aria-expanded", o);
            if (o) setTimeout(function() {
                $$("[data-rv]", s).forEach(function(x) {
                    x.classList.add("in")
                })
            }, 420)
        }
    });
})();

/* ===== Contact: fade the Google map in once it has loaded ===== */
(function() {
    var w = $(".mapw"),
        f = w && $("iframe", w);
    if (!f) return;
    f.addEventListener("load", function() {
        w.classList.add("ld")
    })
})();

/* ===== Academics: sticky Program Overview / Curriculum / Career tabs with scroll-spy ===== */
(function() {
    var ap = $("#p-academics"),
        tabs = $("#actabs");
    if (!ap || !tabs) return;
    var btns = $$("button", tabs),
        ind = $(".abind", tabs),
        secs = btns.map(function(b) {
            return $("#" + b.dataset.go)
        }),
        act = -1,
        lock = 0,
        tick = 0,
        calm = matchMedia("(prefers-reduced-motion:reduce)").matches;

    function place() {
        var b = btns[Math.max(act, 0)];
        if (b && b.offsetWidth) {
            ind.style.left = b.offsetLeft + "px";
            ind.style.width = b.offsetWidth + "px"
        }
    }

    function setAct(k) {
        if (k === act) return;
        act = k;
        btns.forEach(function(b, i) {
            b.classList.toggle("on", i === k);
            b.setAttribute("aria-current", i === k ? "true" : "false")
        });
        place()
    }

    function spy() {
        tick = 0;
        if (!ap.classList.contains("on") || Date.now() < lock) return;
        var line = innerHeight * .38,
            k = 0;
        secs.forEach(function(s, i) {
            if (s.getBoundingClientRect().top <= line) k = i
        });
        if (innerHeight + scrollY >= d.documentElement.scrollHeight - 6) k = secs.length - 1;
        setAct(k)
    }
    addEventListener("scroll", function() {
        if (!tick) tick = requestAnimationFrame(spy)
    }, {
        passive: true
    });
    tabs.addEventListener("click", function(e) {
        var b = e.target.closest("button");
        if (!b) return;
        var k = btns.indexOf(b);
        setAct(k);
        lock = Date.now() + 1100;
        secs[k].scrollIntoView({
            behavior: calm ? "auto" : "smooth",
            block: "start"
        })
    });
    addEventListener("resize", place);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(place);
    addEventListener("hashchange", function() {
        setTimeout(function() {
            if (ap.classList.contains("on")) {
                act = -1;
                setAct(0)
            }
        }, 60)
    });
    setAct(0);
    setTimeout(place, 150);
})();

/* ===== News & Events ===== */
(function() {
    var I = "images/news/",
        M = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        MS = M.map(function(m) {
            return m.slice(0, 3).toUpperCase()
        });

    function G(p, n) {
        var a = [];
        for (var i = 1; i <= n; i++) a.push(I + p + "-" + i + ".jpg");
        return a
    }
    var A = [{
            id: "sportsfest",
            c: "ah",
            t: "Celadon Phoenix Celebrates Victories at SportsFest 2026",
            d: "2026-11-02",
            img: I + "sportsfest-cover.jpg",
            cap: "Sportsfest Awarding Ceremony",
            x: "Team Celadon Phoenix proudly celebrates remarkable achievements across various sporting events, showcasing the strength, unity, and competitive spirit of the SHARP-STED department.",
            b: ["Team Celadon Phoenix, representing the combined strength of the School of Health and Related Professions (SHARP) and STED, demonstrated outstanding teamwork, determination, and sportsmanship throughout Intramurals 2026. United by their passion for competition and school pride, the athletes showcased their talents across various sporting events, bringing honor and recognition to their respective schools.", "Among the team’s remarkable accomplishments was an impressive performance in Athletics, securing 8 gold, 3 silver, and 3 bronze medals. Team Celadon Phoenix also emerged as the Cheerdance Champion and earned the title of 1st Runner-Up in Bench Cheering, demonstrating not only athletic excellence but also creativity, coordination, and strong team spirit.", "Beyond these major victories, the team continued to display its competitive strength through notable performances in Dancesport, Swimming, Table Tennis, Chess, and other sporting events. Each competition reflected the dedication, discipline, and perseverance of the student-athletes who worked tirelessly to represent SHARP-STED with pride.", "These achievements serve as a testament to the unity and collective efforts of Team Celadon Phoenix. More than the medals and titles earned, Intramurals 2026 became a celebration of friendship, collaboration, and the determination to overcome challenges together.", "Through every performance, match, and victory, Team Celadon Phoenix proved that the combined forces of SHARP and STED continue to rise with excellence, resilience, and an unwavering spirit of sportsmanship."],
            g: G("sportsfest", 9)
        },
        {
            id: "leadership",
            c: "ac",
            t: "SHARP Department Strengthens Leadership at Leadership Training Seminar 2026",
            d: "2026-09-06",
            img: I + "leadership.jpg",
            cap: "Leadership Training Seminar 2026",
            b: ["The SHARP Department strengthened the leadership, teamwork, and communication skills of its students through the Leadership Training Seminar 2026, themed “Ignite the Leader Within: Empowering Leaders with Integrity, Purpose, and United Visions.”", "Through guided sessions and group activities, participants learned how to lead with integrity, work well with others, and take initiative both inside and outside the classroom."],
            g: []
        },
        {
            id: "arawngwika",
            c: "ac",
            t: "BSRT Students Showcase Talent and Culture During Araw ng Wika 2026",
            d: "2026-08-13",
            img: I + "arawngwika.jpg",
            pos: "50% 18%",
            cap: "Araw ng Wika 2026",
            b: ["BSRT students proudly showcased their talent and celebrated Filipino culture during Araw ng Wika 2026, representing the School of Radiologic Technology with confidence and pride.", "The celebration was a reminder that learning goes beyond the classroom, and that language and culture are worth celebrating together."],
            g: []
        },
        {
            id: "imbukada",
            c: "ac",
            t: "SMART Department Marches in the Imbukada 2026",
            d: "2026-08-10",
            img: I + "imbukada.jpg",
            pos: "50% 35%",
            cap: "SMART Imbukada 2026",
            b: ["The School of Midwifery and Radiologic Technology (SMART) joined the Imbukada 2026, marching with pride and school spirit alongside the other departments of Southland College.", "Students filled the walkway with energy, colors, and cheers, representing SMART with unity and enthusiasm."],
            g: []
        },
        {
            id: "acquaintance",
            c: "ac",
            t: "Acquaintance Party 2026: Went to the Wrong Party",
            d: "2026-09-18",
            img: I + "acq-cover.jpg",
            cap: "Acquaintance Party 2026",
            x: "The School of Midwifery and Radiologic Technology celebrated the achievements of its students during Southland College’s Acquaintance Party.",
            b: ["The School of Midwifery and Radiologic Technology (SMART) proudly celebrated the achievements of its students during Southland College’s Acquaintance Party 2026, a memorable event filled with talent, confidence, unity, and Southlander pride.", "From the department, Chaese Emmanuel T. Rivas and Yanna Abrielle V. Claridad captivated the audience and earned the Best in Red Carpet award. Chaese further showcased his confidence and communication skills by securing the Best in Question and Answer award, bringing additional recognition to the department.", "During the celebration, SMART Indakan representatives delivered an energetic and spirited performance, earning 3rd Place and showcasing their dedication, teamwork, and skill in performing.", "These accomplishments reflect the talent, determination, and unity of SMART students, as well as their ability to excel beyond academics while proudly representing their department. The celebration served as a meaningful reminder that being a Southlander is not only about academic excellence but also about embracing opportunities, building friendships, and celebrating achievements together."],
            g: G("acq", 8)
        },
        {
            id: "whitecoat",
            c: "ah",
            t: "BSRT Year 4 Students Mark Milestone at 1st White Coating and Candle Lighting Ceremony",
            d: "2026-07-03",
            img: I + "whitecoat.jpg",
            cap: "White Coating and Candle Lighting Ceremony",
            b: ["Bachelor of Science in Radiologic Technology (BSRT) Year 4 students marked an important milestone in their journey as they took part in the 1st White Coating and Candle Lighting Ceremony.", "The ceremony symbolizes the students’ commitment to compassionate, ethical, and professional care as they prepare to enter the field of radiologic technology."],
            g: []
        },
        {
            id: "awards",
            c: "ah",
            t: "Future Healthcare Professionals Recognized at 12th Collegiate Awards Day",
            d: "2026-08-13",
            img: I + "awards.jpg",
            cap: "12th Collegiate Awards Day",
            b: ["Students of the School of Radiologic Technology were recognized for their hard work and excellence at the 12th Collegiate Awards Day.", "The awardees received certificates in front of their families, mentors, and classmates, a reminder that dedication and perseverance are always worth celebrating."],
            g: []
        }
    ];
    A.forEach(function(a) {
        if (!a.x) a.x = a.b[0]
    });
    var AN = [{
            pin: 1,
            t: "Application SY. 2027 - 2028 is now open (Advance)",
            x: "Don’t Miss Out—Your Dream Career Awaits!",
            d: "2026-10-26"
        },
        {
            t: "Final Examination Schedule",
            x: "Target Examination will be November 23 - 27",
            d: "2026-10-20"
        },
        {
            t: "Clearance Signing",
            x: "The Signing of clearance will begin in the Final term",
            d: "2026-10-18"
        },
        {
            t: "Celebration Of RadTech Day",
            x: "Celebration of Radtech day will be on Nov 8, 2026. Wait for further announcement",
            d: "2026-10-19"
        }
    ];
    var EV = {
        "2026-11-02": "SportsFest 2026 awarding ceremony",
        "2026-11-08": "RadTech Day",
        "2026-11-18": "Clearance signing",
        "2026-11-23": "Final examinations",
        "2026-11-24": "Final examinations",
        "2026-11-25": "Final examinations",
        "2026-11-26": "Final examinations",
        "2026-11-27": "Final examinations"
    };
    var PIN = "<svg viewBox='0 0 24 24' width='26' height='26' fill='currentColor' aria-hidden='true'><path d='M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z'/></svg>";

    function fd(s) {
        var p = s.split("-");
        return M[+p[1] - 1] + " " + p[2] + ", " + p[0]
    }

    function esc(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    }

    function by(c) {
        return A.filter(function(a) {
            return a.c == c
        })
    }
    var v = $("#nview"),
        tabs = $(".ntabs"),
        cat = "all",
        yr = "all",
        LIM = {
            an: 3,
            ac: 4,
            ah: 3
        };

    function tg(a, s) {
        return a.c == "ah" ? (s ? "Achievement" : "Achievements") : "Activities"
    }

    function small(a, i) {
        var u = "#n-" + a.id;
        return "<article class='nc' style='--i:" + (i || 0) + "'><a class='nimg' href='" + u + "' tabindex='-1' aria-hidden='true'><img loading='lazy' alt='' src='" + a.img + "'" + (a.pos ? " style='object-position:" + a.pos + "'" : "") + "></a><div class='nct'><span class='ntag'>" + tg(a) + "</span><h3><a href='" + u + "'>" + esc(a.t) + "</a></h3><time>" + fd(a.d) + "</time></div></article>"
    }

    function feat(a) {
        var u = "#n-" + a.id;
        return "<article class='nc feat'><a class='nimg' href='" + u + "' tabindex='-1' aria-hidden='true'><img alt='' src='" + a.img + "'></a><div class='nct'><span class='ntag'>" + tg(a, 1) + "</span><time>" + fd(a.d) + "</time><h3><a href='" + u + "'>" + esc(a.t) + "</a></h3><p>" + esc(a.x) + "</p><a class='nrd' href='" + u + "'>Read More <i aria-hidden='true'>→</i></a></div></article>"
    }

    function sh(t, k, go) {
        return "<div class='nsh " + k + "'><h2>" + t + "</h2>" + (go ? "<button type='button' class='nva' data-go='" + go + "'>" + (go == "sc" ? "Proceed" : "View all") + (go == "sc" ? " <i aria-hidden='true'>→</i>" : "") + "</button>" : "") + "</div>"
    }

    function db(d) {
        var p = d.split("-");
        return "<span class='db'><b>" + (+p[2]) + "</b>" + MS[+p[1] - 1] + "</span>"
    }

    function row(a, i) {
        return "<div class='arow' style='--i:" + (i || 0) + "'><div><h3>" + esc(a.t) + "</h3><p>" + esc(a.x) + "</p></div>" + db(a.d) + "</div>"
    }

    function today() {
        var n = new Date(),
            k = n.getFullYear() + "-" + ("0" + (n.getMonth() + 1)).slice(-2) + "-" + ("0" + n.getDate()).slice(-2);
        return MS[n.getMonth()] + " " + ("0" + n.getDate()).slice(-2) + ", " + n.getFullYear() + " : <b>" + (EV[k] ? EV[k].toUpperCase() : "NO EVENTS ARE SCHEDULED FOR TODAY") + "</b>"
    }

    function pills() {
        return "<div class='npills'>" + ["all", "2026", "2025"].map(function(y) {
            return "<button type='button' data-y='" + y + "' class='" + (y == yr ? "on" : "") + "'>" + (y == "all" ? "All" : y) + "</button>"
        }).join("") + "</div>"
    }

    function more(n, t) {
        return "<p class='nmore'><button class='btn dk' id='nmore' type='button'>See More</button></p>"
    }

    function ac() {
        return by("ac").filter(function(a) {
            return yr == "all" || a.d.slice(0, 4) == yr
        })
    }

    function page() {
        if (cat == "all") {
            var f = by("ah")[0],
                ach = by("ah").slice(1, 3),
                act = by("ac").slice(0, 2);
            return "<div>" + sh("Announcements", "u") + "<div class='abn pinned hb'><span class='pin'>" + PIN + "</span><div><h3>" + esc(AN[0].t) + "</h3><p>" + esc(AN[0].x) + "</p></div><a class='btn dk' href='#enrollment'>Enroll now</a></div></div>" +
                "<div>" + sh("Latest News", "u") + feat(f) + "</div>" +
                "<div>" + sh("Activities", "i", "ac") + "<div class='ngrid'>" + act.map(small).join("") + "</div></div>" +
                "<div>" + sh("Achievements", "i", "ah") + "<div class='ngrid'>" + ach.map(small).join("") + "</div></div>" +
                "<div>" + sh("School Calendar Update", "u", "sc") + "<div class='cinfo'>" + today() + "</div></div>"
        }
        if (cat == "an") {
            var r = AN.slice(1);
            return "<div class='ahead'><span class='ntag'>Pinned</span><em>Posted on:</em></div><div class='abn pinned'><span class='pin'>" + PIN + "</span><div><h3>" + esc(AN[0].t) + "</h3><p>" + esc(AN[0].x) + "</p></div>" + db(AN[0].d) + "</div><div class='alist' id='nitems'>" + r.slice(0, LIM.an).map(row).join("") + "</div>" + more(r.length, LIM.an)
        }
        if (cat == "ac") {
            var l = ac();
            return pills() + (l.length ? "<div class='ngrid' id='nitems'>" + l.slice(0, LIM.ac).map(small).join("") + "</div>" : "<p class='nempty'>No posts for " + yr + " yet.</p>") + more(l.length, LIM.ac)
        }
        var h = by("ah");
        return "<div class='ngrid' id='nitems'>" + feat(h[0]) + h.slice(1, LIM.ah).map(small).join("") + "</div>" + more(h.length, LIM.ah)
    }

    function draw() {
        v.innerHTML = page();
        [].forEach.call(v.children, function(c, i) {
            c.style.setProperty("--i", i)
        })
    }

    function setCat(c) {
        if (c == cat) return;
        cat = c;
        yr = "all";
        LIM = {
            an: 3,
            ac: 4,
            ah: 3
        };
        var sc = c == "sc",
            C = $("#ncal");
        $$("button", tabs).forEach(function(b) {
            var o = b.dataset.f == c;
            b.classList.toggle("on", o);
            b.setAttribute("aria-selected", o)
        });
        if (sc) {
            v.hidden = true;
            C.hidden = false;
            C.classList.remove("nin");
            void C.offsetWidth;
            C.classList.add("nin");
            drawCal()
        } else {
            C.hidden = true;
            v.hidden = false;
            draw()
        }
        setTimeout(ind, 0)
    }
    tabs.addEventListener("click", function(e) {
        var b = e.target.closest("button");
        if (b && b.dataset.f) setCat(b.dataset.f)
    });
    v.addEventListener("click", function(e) {
        var g = e.target.closest("[data-go]");
        if (g) {
            setCat(g.dataset.go);
            tabs.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            return
        }
        var y = e.target.closest("[data-y]");
        if (y) {
            yr = y.dataset.y;
            LIM.ac = 4;
            draw();
            return
        }
        if (e.target.closest("#nmore")) {
            var n = $("#nitems").children.length,
                items, fn;
            if (cat == "an") {
                items = AN.slice(1);
                fn = row;
                LIM.an += 4
            } else if (cat == "ac") {
                items = ac();
                fn = small;
                LIM.ac += 4
            } else {
                items = by("ah");
                fn = small;
                LIM.ah += 4
            }
            var lim = LIM[cat];
            items.slice(cat == "ah" ? n : n, lim).forEach(function(a, k) {
                $("#nitems").insertAdjacentHTML("beforeend", fn(a, k))
            });
            if (items.length <= lim) {
                var mb = $("#nmore");
                mb.disabled = true;
                mb.textContent = "No more posts"
            }
        }
    });
    addEventListener("hashchange", function() {
        if ((location.hash || "") == "#news") {
            cat = "";
            setCat("all")
        }
    });
    /* article page */
    window.showArt = function(id) {
        var a = A.filter(function(x) {
            return x.id == id
        })[0];
        if (!a) {
            location.hash = "#news";
            return
        }
        $("#atag").textContent = a.c == "ah" ? "Achievement" : "Activities";
        $("#atitle").textContent = a.t;
        $("#adate").textContent = fd(a.d);
        $("#aimg").src = a.img;
        $("#aimg").alt = a.cap;
        $("#acap").textContent = a.cap;
        $("#nback").textContent = "Back to " + (a.c == "ah" ? "Achievement" : "Activities");
        $("#abody").innerHTML = a.b.map(function(p) {
            return "<p>" + esc(p) + "</p>"
        }).join("");
        $("#ahl").hidden = !a.g.length;
        $("#agal").innerHTML = a.g.map(function(s, k) {
            return "<button type='button' style='--i:" + k + "' aria-label='View photo " + (k + 1) + "'><img loading='lazy' alt='' src='" + s + "'></button>"
        }).join("")
    };
    $("#nback").addEventListener("click", function() {
        var c = A.filter(function(a) {
            return "n-" + a.id == (location.hash || "").slice(1)
        })[0];
        if (c) {
            cat = "";
            setCat(c.c)
        }
    });
    /* lightbox */
    var lb = $("#lbx"),
        li = $("img", lb);
    $("#agal").addEventListener("click", function(e) {
        var b = e.target.closest("button");
        if (!b) return;
        li.src = $("img", b).src;
        lb.classList.add("on");
        lb.setAttribute("aria-hidden", "false")
    });

    function cl() {
        lb.classList.remove("on");
        lb.setAttribute("aria-hidden", "true")
    }
    lb.addEventListener("click", cl);
    addEventListener("keydown", function(e) {
        if (e.key == "Escape") cl()
    });
    /* calendar */
    var now = new Date(),
        cy = now.getFullYear(),
        cm = now.getMonth(),
        dir = 0;

    function k2(y, m, d) {
        return y + "-" + ("0" + (m + 1)).slice(-2) + "-" + ("0" + d).slice(-2)
    }
    var sel = k2(cy, cm, now.getDate());

    function info() {
        var p = sel.split("-"),
            t = MS[+p[1] - 1] + " " + p[2] + ", " + p[0],
            e = EV[sel],
            td = sel == k2(now.getFullYear(), now.getMonth(), now.getDate());
        $("#cinfo").innerHTML = t + " : <b>" + (e ? e.toUpperCase() : "NO EVENTS ARE SCHEDULED FOR " + (td ? "TODAY" : "THIS DAY")) + "</b>"
    }

    function drawCal() {
        var ds = $("#cdays"),
            f = new Date(cy, cm, 1).getDay(),
            n = new Date(cy, cm + 1, 0).getDate(),
            h = "",
            i;
        $("#cmon").innerHTML = M[cm].toUpperCase() + " <small>" + cy + "</small>";
        for (i = 0; i < f; i++) h += "<span class='cd e'></span>";
        for (i = 1; i <= n; i++) {
            var k = k2(cy, cm, i);
            h += "<button type='button' class='cd" + (k == sel ? " s" : "") + (EV[k] ? " ev" : "") + "' data-k='" + k + "' style='--i:" + (i + f) + "'>" + i + "</button>"
        }
        ds.className = "cdays" + (dir ? (dir > 0 ? " fr" : " fl") : "");
        ds.innerHTML = h;
        void ds.offsetWidth;
        ds.classList.add("go");
        info()
    }

    function mv(d) {
        dir = d;
        cm += d;
        if (cm > 11) {
            cm = 0;
            cy++
        }
        if (cm < 0) {
            cm = 11;
            cy--
        }
        drawCal()
    }
    $("#cprev").onclick = function() {
        mv(-1)
    };
    $("#cnext").onclick = function() {
        mv(1)
    };
    $("#cdays").addEventListener("click", function(e) {
        var b = e.target.closest(".cd[data-k]");
        if (!b) return;
        sel = b.dataset.k;
        $$(".cd.s").forEach(function(x) {
            x.classList.remove("s")
        });
        b.classList.add("s");
        info();
        var c = $("#cinfo");
        c.classList.remove("pop");
        void c.offsetWidth;
        c.classList.add("pop")
    });
    draw();
    setTimeout(function() {
        route();
        ind()
    }, 0);
})();