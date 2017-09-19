document.addEventListener('DOMContentLoaded', function() {
  var iota = new IOTA({
    // Host and provider are only needed if the user intends to generate the address deterministically
    'host': 'http://localhost',
    'port': 14265
  })

  var seed
  var userSeed = document.getElementById('userSeed')
  var saveSeed = document.getElementById('saveSeed')
  var seedInputForm = document.getElementById('seedInputForm')
  var finalAddress = document.getElementById('finalAddress')

  //  Properly formats the seed, replacing all non-latin chars with 9's
  //  And extending it to length 81
  //
  function setSeed(value) {

    seed = ""
    var value = value.toUpperCase()

    for (var i = 0; i < value.length; i++) {
      if (("9ABCDEFGHIJKLMNOPQRSTUVWXYZ").indexOf(value.charAt(i)) < 0) {
        seed += "9";
      } else {
        seed += value.charAt(i)
      }
    }
  }

  saveSeed.addEventListener('click', function() {
    // We modify the entered seed to fit the criteria of all uppercase and only latin letters
    setSeed(userSeed.value)

    // Set the modified seed value as placeholder
    userSeed.value = seed

    // Disable the seed input
    userSeed.disabled = true

    // Then we remove the warning
    seedInputForm.classList.remove('has-warning')
    seedInputForm.classList.add('has-success')
  })

  document.querySelector("#generateAddress").addEventListener('click', function() {
    var options = {}
    let keyIndex = document.getElementById('keyIndex')
    let security = document.getElementById('security')
    let checksum = document.getElementById('checksum')

    // Get all the respective values from the user
    options.index = parseInt(keyIndex.value)
    options.security = parseInt(security.value)
    options.checksum = checksum.checked
    var deterministic = document.getElementById('deterministic').checked

    // If the user does not want to generate the address deterministically
    // generate a total of 1 addresses
    if (!deterministic) {
      options.total = 1
    }

    // if no seed, negative key index, return
    if ( !seed ||  options.index < 0 )
      return

    console.log("YOUR CHOSEN OPTIONS: ", options)

    // Generate a new address according to the user inputs
    iota.api.getNewAddress( seed, options, function( e, address ) {
      if (e) {
        throw e
      }
      // Set the address as placeholder 
      finalAddress.value = address
    })
  })
})