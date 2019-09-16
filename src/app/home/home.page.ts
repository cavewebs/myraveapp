import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { Rave, RavePayment, Misc } from 'rave-ionic4';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

 amount:number = 3700.00;

  constructor(
  private rave: Rave, 
  private ravePayment: RavePayment, 
  private misc: Misc,
  private iab: InAppBrowser
    ) { }



 ravePay() {
      this.rave.init(true, "FLWPUBK-77350cbb62c4eb4aa8c4b78b6ff28df1-X")
      .then(_ => {
        var paymentObject = this.ravePayment.create({
          customer_email: "user@example.com",
          amount: this.amount,
          customer_phone: "234099940409",
          currency: "NGN",
          txref: "rave-123456",
          meta: [{
              metaname: "flightID",
              metavalue: "AP1234"
          }]
      })
        this.rave.preRender(paymentObject)
          .then(secure_link => {
            secure_link = secure_link +" ";
            const browser: InAppBrowserObject = this.rave.render(secure_link, this.iab);
            browser.on("loadstop")
                .subscribe((event: InAppBrowserEvent) => {
                  if(event.url.indexOf('http://localhost:8100/home') != -1) {
                    if(this.rave.paymentStatus('url') == 'failed') {
                      console.log("Message", "Oops! Transaction failed");
                    }else {
                      console.log("Message", "Transaction Succesful");

                    }
                    browser.close()
                  }
                })
          }).catch(error => {
            // Error or invalid paymentObject passed in
            console.log ("error", error);
          })
      })

    }

}
