package com.railsafe.webapp_backend;

import com.WebappBackendApplication;
import com.service.IRSensorService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest(classes = WebappBackendApplication.class, properties = {
		"spring.autoconfigure.exclude="
				+ "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,"
				+ "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,"
				+ "org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration"
})
class WebappBackendApplicationTests {

	@MockBean
	private IRSensorService irSensorService;

	@Test
	void contextLoads() {
	}

}
