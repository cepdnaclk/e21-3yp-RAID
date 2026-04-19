package com.repositary;

import com.model.EspCamDetection;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
@EnableScan
public interface EspCamRepository extends CrudRepository<EspCamDetection, String> {
    // Spring Data DynamoDB will now talk to that specific AWS table
}