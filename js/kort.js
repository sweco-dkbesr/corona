function getColorValueFromSmittetCount(smittet) {
    if (smittet == -1) {
        return 'white';
    } else if (smittet > -1 && smittet <= 50) {
        return '#ffeabf';
    } else if (smittet > 50 && smittet <= 100) {
        return '#ffd580';
    } else if (smittet > 100 && smittet <= 150) {
        return '#ffaa00';
    } else if (smittet > 150 && smittet <= 200) {
        return '#ffaa00';
    } else if (smittet > 200 && smittet <= 250) {
        return '#ffaa00';
    } else if (smittet > 250) {
        return '#ffaa00';
    }
}

// function clickListener (eventname, data) {
//     var defaultParamsPoint = {
//         distance: 0,
//         layers: 'theme-kommune_graenser',
//         profile: 'corona',
//         profilequery: 'info',
//         wkt: data
//     };
//     aMiniMap.getSession().createSpatialQuery().executeSimple(defaultParamsPoint, function (response) {
//         var obj = response.targets[0].hits[0].columns;
//
//         var regNavn = obj[0].value;
//         var komNavn = obj[1].value;
//         var komKode = obj[2].value;
//         var html = '';
//         // html += '<h1>' + regNavn + '</h1></br>';
//         html += '<span>' + komNavn + '</span>:';
//         // html += '<h3>' + komKode + '</h3></br>';
//         html += '<table>';
//         html += '<thead>';
//         html += '<tr>';
//         html += '<th>Dato</th>';
//         html += '<th>antal</th>';
//         html += '</tr>';
//         html += '</thead>';
//         html += '<tbody>';
//         html += '<tr>row 1</tr>';
//         html += '<tr>row 2';
//
//         for (j = 0; j<= datesSearch.length; j++) {
//             var smittet = komdata[datesSearch[j]];
//             if (typeof (smittet) !== 'undefined') {
//                 for (i = 0; i < Object.keys(smittet).length; i++) {
//                     var curKomkode = Object.keys(smittet)[i];
//                     if (curKomkode == komKode) {
//                         var curAntal = Object.values(smittet)[i];
//                         console.log(curAntal);
//                         html += '<td><div style="background-color:' +
//                             getColorValueFromSmittetCount(curAntal) + ';height:' + curAntal + 'px">' + curAntal
//                             + '</div></td>'
//                     }
//                 }
//             }
//         }
//         html += '</tr>';
//
//         //                 var curAntal = Object.values(smittet)[i];
//         //
//         //                 html += '<tr>';
//         //                 html += '  <td>' + dates[j] + '</td>';
//         //                 html += '  <td style="background-color: ' +
//         //                     getColorValueFromSmittetCount(curAntal) + '; width: ' + curAntal +'px;">' + curAntal +'</td>';
//         //                 html += '</tr>';
//         //             }
//         //         }
//         //     }
//         // }
//         html += '</tbody>';
//         html += '</table>';
//         spsjq("#komdata").html(html);
//
//     })
// }

function hoverListener(eventName, data) {
    console.log("hL", data);
}

function clickListener (eventname, data) {
    var defaultParamsPoint = {
        distance: 0,
        layers: 'theme-kommune_graenser',
        profile: 'corona',
        profilequery: 'info',
        wkt: data
    };
    aMiniMap.getSession().createSpatialQuery().executeSimple(defaultParamsPoint, function (response) {
        var obj = response.targets[0].hits[0].columns;

        var regNavn = obj[0].value;
        var komNavn = obj[1].value;
        var komKode = obj[2].value;

        var smittetTimeSeriesForMunicipality = [];

        for (j = 0; j<= datesSearch.length; j++) {
            var smittet = komdata[datesSearch[j]];
            if (typeof (smittet) !== 'undefined') {
                for (i = 0; i < Object.keys(smittet).length; i++) {
                    var curKomkode = Object.keys(smittet)[i];
                    if (curKomkode == komKode) {
                        var curAntal = Object.values(smittet)[i];
                        smittetTimeSeriesForMunicipality.push({
                            date: datesSearch[j],
                            value: curAntal
                        })
                    }
                }
            }
        }

        // console.log(smittetTimeSeriesForMunicipality); [{dato, value}]
        timeSeries(smittetTimeSeriesForMunicipality)

        // spsjq("#komdata").html(html);

    })
}

window.addEventListener('load', function () {
    MiniMap.createMiniMap({
        mapDiv: 'minimapbody',
        minimapId: '4d8d7293-42e5-43b8-be6a-e539c5f17f74',
        initCallback: function (mm) {

            initTimeSeries();

            window.aMiniMap = mm;

            var clickListenerC = aMiniMap.addListener("MAP_CLICKED", clickListener);
            var hoverListenerC = aMiniMap.addListener("FEATURE_HOVER", hoverListener);

            buttonToogle();

            var styleNulSmittet = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'white'
                })
            })
            var style5Til50Smittet = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: '#ffeabf'
                })
            })
            var style51Til100Smittet = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: '#ffd580'
                })
            })
            var style101Til150Smittet = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: '#ffaa00'
                })
            })
            var style151Til200Smittet = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: '#ffaa00'
                })
            })
            var style200Til250Smittet = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: '#ffaa00'
                })
            })
            var styleFlereEnd250Smittet = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'black'
                })
            })

            dl = new MiniMap.Gui.Draw.DrawLayer({minimap: mm, allowMultiGeometries: true});
            //Definer style-functions

            //anvende stylefunktion i stedet hardcoded styles

            function styleCorona(curFeature) {
                // var smittede = curFeature.attributes.data[sliderDate];
                var smittet = curFeature.attributes.smittet;
                if (smittet == -1) {
                    return styleNulSmittet;
                } else if (smittet > -1 && smittet <= 50) {
                    return style5Til50Smittet;
                } else if (smittet > 50 && smittet <= 100) {
                    return style51Til100Smittet;
                } else if (smittet > 100 && smittet <= 150) {
                    return style51Til100Smittet;
                } else if (smittet > 150 && smittet <= 200) {
                    return style151Til200Smittet;
                } else if (smittet > 200 && smittet <= 250) {
                    return style200Til250Smittet;
                } else if (smittet > 250 && smittet <= 250) {
                    return styleFlereEnd250Smittet;
                }
            }

            function dsReadHandler(features) {
                if (features.exception) {
                    console.error(features.exception.message);
                    return;
                }
                dl.clearFeatures();
                dl.addFeatures(features, false, true);
                mm.getSession().getDatasource("ds_corona_komdata")
                    .execute({command: "read"}, dsReadDataHandler, "FEATURES");
            }

            // handle all fetched dates
            function dsReadDataHandler(rows) {

                var curDate = '';
                rows.forEach(function (row, index, array) {
                    curDate = row.attributes.dato.substring(0, 10);

                    komnrKomnavn[row.attributes.komnrtxt] = row.attributes.komnavn;

                    smittet = komdata[curDate];
                    if (smittet == null) {
                        smittet = {};
                    }
                    smittet[row.attributes.komnrtxt] = row.attributes.smittet
                    komdata[curDate] = smittet;

                    if (index == array.length - 1) {
                        // debugger;
                        callback()
                    }

                })
                // console.log(komnrKomnavn);
                // console.log(komdata);

            }

            function callback() {
                console.log('dsReadDataHandler done');
                themesToogle();
                updateDate();
                createBars();

            }

            /*
            function getOlFeature(komkode)
            {
                var featureArray = dl.getFeatures();
                featureArray.forEach(function (feature) {
                    if (}
                }
                var length = featureArray.length;
                return null;
            }
            */
            mm.getSession().getDatasource("ds_corona_komflader").execute({command: "read"}, dsReadHandler, "FEATURES");
            dl.olSetStyle(styleCorona);


            //var theme = themes[currentIndex];

            //window.aMiniMap.getTheme(theme).toggle();

            //spsjq('#stepback_slider').button({ icons: {primary:'ui-icon-seek-first'} })
            //spsjq('#stepforward_slider').button({ icons: {primary:'ui-icon-seek-end'} })
            //mm.addControl("SearchControl");

            //var geoSearchService = new MiniMap.GeoSearchService(mm, {});

            //mm.searchHandler.addService(geoSearchService);
        }
    })
});

function back() {
    //alert('test');
    console.log('-----------tilbage---------');
    if (currentIndex > 0) {
        currentIndex--;
        themesToogle();
        updateDate();
        createBars();
    }
}

function forward() {
    console.log('-----------frem---------');

    var date = datesSearch[currentIndex];
    console.log('dato:' + date);
    var smittet = komdata[date];
    if (currentIndex <= dates.length - 1) {
        currentIndex++;
        themesToogle();
        updateDate();
        createBars();

    }
}

function updateDate() {
    searchDate = datesSearch[currentIndex];
    smittet = komdata[searchDate]
    if (typeof (smittet) !== 'undefined') {
        spsjq("#dato").text(dates[currentIndex]);
    }

}

function themesToogle(index) {

    var smittet = komdata[datesSearch[currentIndex]];
    if (typeof (smittet) !== 'undefined') {
        var featureArray = dl.getFeatures();
        featureArray.forEach(function (feature) {
            var komkode = feature.attributes.komkode;
            var antal = -1;
            if (typeof (smittet[komkode]) !== 'undefined') {
                antal = smittet[komkode];
            } else {
                console.log('Date:' + datesSearch[currentIndex] + ' - komkode:' + komkode + ' missing');
            }
            feature.attributes.smittet = antal;
        })
    }
    dl.repaint();

    buttonToogle();
}

function buttonToogle() {

    if (currentIndex == 0) {
        spsjq("#btnBack").prop('disabled', true);
        spsjq("#btnBack").css('background-color', 'grey');
    } else {
        spsjq("#btnBack").prop('disabled', false);
        spsjq("#btnBack").css('background-color', 'yellow');
    }
    if (currentIndex >= dates.length - 2) {
        spsjq("#btnForward").prop('disabled', true);
        spsjq("#btnForward").css("background-color", 'grey');
    } else {
        spsjq("#btnForward").prop('disabled', false);
        spsjq("#btnForward").css("background-color", 'yellow');
    }
}

/**
 * Build the bar chart.
 */
function createBars() {
    var html = '';
    html += '<table>';
    html += '<tbody>';
    var smittet = komdata[datesSearch[currentIndex]];
    if (typeof (smittet) !== 'undefined') {
        for (i = 0; i < Object.keys(smittet).length; i++) {
            var obj = smittet[i];
            var komkode = Object.keys(smittet)[i];
            var antal = Object.values(smittet)[i];
            html += '<tr>';
            html += '  <td>' + komnrKomnavn[komkode] + '</td>';
            html += '  <td style="background-color: ' +
                getColorValueFromSmittetCount(antal) + '; width: ' + antal + 'px;"><div class="pushed-label "style="padding-left:' + (Number(antal) + 5) + 'px;">' + antal + '</div></td>';
            html += '</tr>';
        }
    }
    html += '</tbody>';
    html += '</table>';
    spsjq("#oversigt").html(html);
}
