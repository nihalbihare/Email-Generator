package com.emailGen.emailGenerator.api;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/email")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class EmailGeneratorController {

    private EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
 public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        String response = emailGeneratorService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);


    }

}
