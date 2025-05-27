package com.pushkar.PaymentGateway.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    // Replace with your Twilio credentials
    private final String ACCOUNT_SID = "ACff35b0b0288d8a7b9c91854da63b4e47";
    private final String AUTH_TOKEN = "e69b256ba64b7f5f593a3b6bc52a33eb";
    private final String FROM_NUMBER = "whatsapp:+14322493160";  // Twilio sandbox number

    public WhatsAppService() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public void sendMessage(String to, String messageBody) {
        Message message = Message.creator(
                new PhoneNumber("whatsapp:" + to),
                new PhoneNumber(FROM_NUMBER),
                messageBody
        ).create();

        System.out.println("Message SID: " + message.getSid());
    }
}
