package com.company.project.service.implementations;

import com.company.project.domain.entity.Client;
import com.company.project.dto.ClientDTO;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.ClientRepository;
import com.company.project.service.interfaces.ClientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));
        return toDTO(client);
    }

    private ClientDTO toDTO(Client c) {
        ClientDTO dto = new ClientDTO();
        dto.setId(c.getId());
        dto.setCustomerName(c.getCustomerName());
        dto.setAddress1(c.getAddress1());
        dto.setAddress2(c.getAddress2());
        dto.setAddress3(c.getAddress3());
        dto.setSuburb(c.getSuburb());
        dto.setState(c.getState());
        dto.setPostCode(c.getPostCode());
        return dto;
    }
}
