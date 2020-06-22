var g_nm_i;

//var dd = d3.select("#selDataset").property("value");
//var id = [];

//function to add elements to drop down
function dd(cat,arr) {
  var c = d3.select(cat)
  arr.forEach((x) => {
  c.append("option").text(x)
  });
};
///var demo = []
// Fetch the JSON data
d3.json("samples.json").then(function(data) {
    data = data[0];

    //need to understand global vs. local variables
    //extract ID's out of json
    var nm = data.names;
    meta = data.metadata;
    sa = data.samples;
    
        
    
    //Populate drop down list
    dd("#selDataset",nm)
    g_nm_i = nm[0]
    id_no(g_nm_i)
    
    //not sure if I need this or not
    //d3.event.preventDefault();
});
 
  function id_no(id) {
      
      //filter data to get just id data
      var sa_filt = sa.filter(x => x.id === id);
      var meta_filt = meta.filter(record => record.id === parseInt(id));
      //map labels, values, and hover data and slice only first 10
      //[0] is because it has one level below main list
      var lab = sa_filt.map(y => y.otu_ids)[0].slice(0,10);
      var val = sa_filt.map(y => y.sample_values)[0].slice(0,10);
      var hov = sa_filt.map(y => y.otu_labels)[0].slice(0,10);
      var eth = meta_filt[0].ethnicity;
      var demo = {"Ethnicity":meta_filt[0].ethnicity,
                "Gender":meta_filt[0].gender,
                "Age":meta_filt[0].age,
                "Location":meta_filt[0].location,
                "bbtype":meta_filt[0].bbtype,
                "wfreq":meta_filt[0].wfreq}

      
      lab = lab.map(String);
      lab = lab.map(x => 'OTU Id ' + x + '  ').reverse();  
      val = val.reverse();
      hov = hov.reverse();
      
      bc(val,lab,hov,id)

      
      //below is two different ways to extract the different lists
      //this is drilling in, 0 to otu_ids and so forth
      var sa_filt_ids = sa_filt[0].otu_ids
      var sa_filt_val = sa_filt[0].sample_values
      
      //this is using map to map the values
      var b_lab = sa_filt.map(y => y.otu_ids)[0];
      var b_val = sa_filt.map(y => y.sample_values)[0];
 
      /// define array for bubble hover's
      var bh = []
      var b2 = []
      
      //Must use list for foreach, added i for index and mine b_val

      b_lab.forEach(function(x,i) {
          b2.push(`ID = ${x}<br>Value = ${b_val[i]}`)
      });
            
       //for loop to concatenate
      for (var i = 0; i < sa_filt_ids.length; i++) {
          bh.push(`ID = ${b_lab[i]}<br>Value = ${b_val[i]}`)
      };

      
      //var bh = sa_filt.map(y => `ID = ${y.otu_ids}, Value = ${y.sample_values}`)[0]
 
      bub(b_lab, b_val, bh, id);
      
      //select table body
      var tr = d3.select("tbody");
      //clear current table body
      tr.html("");
      dict_2_list(demo,"#sample-metadata")
  };
//function to create a bar chart
  function bc(cv, cl, ch, id) {
    ///Trace to chart

    var trace = {
      x: cv,
      y: cl,
      text: ch,
      type: "bar",
      orientation: "h"
    };
    
    //chart data
    var data = [trace];

    var layout = {
      title: `Id No: ${id}`,
      //yaxis: {title: "OTU ID"},
      xaxis: {title: "OTU Value"}
    };

    // Plot
    Plotly.newPlot("bar", data, layout);
  };

  function bub(cx, cy, bh, id) {
    ///Trace to chart

    var trace = {
      x: cx,
      y: cy,
      marker: {size: cy, sizeref: .05, sizemode: 'area', 
              color: cx},
      mode: 'markers',
      text: bh
    };
    
    //chart data
    var data = [trace];

    var layout = {
      title: `Id No: ${id}`,
      yaxis: {title: "OTU Value"},
      xaxis: {title: "OTU ID"},
      showlegend: false
    };

    // Plot
    Plotly.newPlot("bubble", data, layout);
  };

  function dict_2_list(dict,id) {


////formatting is not quite right
console.log(dict)


/////Object.keys returns just the keys
//////Object.keys turns keys into a list
/////2x methods to do object iterations
  //   Object.keys(dict).forEach(function(key) {
  //     var trow = d3.select("tbody").append("tr");
  //     trow.append("td").text(key);
  //     trow.append("td").text(dict[key]);
  // });

  /////Object.entris to return Key and Values in dictionary
  /////Object.entries turns dictionary into key value pairs
  /////Arrow function won't work because it's multiple statements

    Object.entries(dict).forEach(function([x,y]) { 
      var trow = d3.select("tbody").append("tr");
      trow.append("td").text(x);
      trow.append("td").text(y);
    });



  }