package com.railsafe.webapp_backend;

import com.WebappBackendApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = WebappBackendApplication.class, properties = {
		"spring.autoconfigure.exclude="
				+ "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,"
				+ "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,"
				+ "org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration",
		"aws.iot.auto-startup=false",
		"aws.iot.broker.url=ssl://localhost:8883",
		"aws.iot.broker.clientId=test-client-id",
		"aws.iot.topic.filter=test/topic",
		"aws.region=eu-north-1",
		"aws.accessKeyId=test-access-key",
		"aws.secretKey=test-secret-key",
		"aws.dynamodb.tableName=test-table"
})
class WebappBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
