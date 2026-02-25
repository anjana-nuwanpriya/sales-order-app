package com.company.project.repository;

import com.company.project.domain.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    @Query("SELECT so FROM SalesOrder so JOIN FETCH so.client ORDER BY so.id DESC")
    List<SalesOrder> findAllWithClient();
}
