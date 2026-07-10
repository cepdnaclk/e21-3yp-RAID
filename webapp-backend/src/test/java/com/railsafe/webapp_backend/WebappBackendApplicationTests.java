package com.railsafe.webapp_backend;

import com.WebappBackendApplication;
import com.integration.IntegrationTestBeanConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = WebappBackendApplication.class, properties = {
		"spring.autoconfigure.exclude="
				+ "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,"
				+ "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,"
				+ "org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration",
		"aws.iot.auto-startup=false",
		"spring.main.allow-bean-definition-overriding=true"
})
@ActiveProfiles("ci")
@Import(IntegrationTestBeanConfig.class)
class WebappBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
