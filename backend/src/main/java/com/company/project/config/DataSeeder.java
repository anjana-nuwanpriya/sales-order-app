package com.company.project.config;

import com.company.project.domain.entity.Client;
import com.company.project.domain.entity.Item;
import com.company.project.repository.ClientRepository;
import com.company.project.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;

    public DataSeeder(ClientRepository clientRepository, ItemRepository itemRepository) {
        this.clientRepository = clientRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    public void run(String... args) {
        if (clientRepository.count() == 0) {
            seedClients();
            System.out.println("Seeded sample clients");
        }
        if (itemRepository.count() == 0) {
            seedItems();
            System.out.println("Seeded sample items");
        }
    }

    private Client makeClient(String name, String a1, String a2, String a3, String suburb, String state, String postCode) {
        Client c = new Client();
        c.setCustomerName(name);
        c.setAddress1(a1);
        c.setAddress2(a2);
        c.setAddress3(a3);
        c.setSuburb(suburb);
        c.setState(state);
        c.setPostCode(postCode);
        return c;
    }

    private Item makeItem(String code, String desc, String price) {
        Item i = new Item();
        i.setItemCode(code);
        i.setDescription(desc);
        i.setPrice(new BigDecimal(price));
        return i;
    }

    private void seedClients() {
        clientRepository.saveAll(Arrays.asList(
            makeClient("Acme Corporation",      "123 Main Street",    "Suite 100", "",         "Springfield", "VIC", "3000"),
            makeClient("Global Tech Solutions", "45 Innovation Drive", "",          "",         "Melbourne",   "VIC", "3004"),
            makeClient("Pacific Trading Co",    "789 Harbor Road",    "Level 3",   "Building B","Sydney",     "NSW", "2000"),
            makeClient("Sunrise Industries",    "22 Commerce Street", "",           "",         "Brisbane",    "QLD", "4000"),
            makeClient("Delta Enterprises",     "5 Business Park",    "Unit 7",    "",         "Perth",       "WA",  "6000")
        ));
    }

    private void seedItems() {
        itemRepository.saveAll(Arrays.asList(
            makeItem("ITM001", "Office Chair - Ergonomic",          "299.99"),
            makeItem("ITM002", "Standing Desk - Height Adjustable", "549.00"),
            makeItem("ITM003", "Monitor 27-inch 4K",                "699.95"),
            makeItem("ITM004", "Mechanical Keyboard",               "129.00"),
            makeItem("ITM005", "Wireless Mouse",                     "79.50"),
            makeItem("ITM006", "USB-C Hub 7-Port",                   "59.99"),
            makeItem("ITM007", "Webcam HD 1080p",                   "119.00"),
            makeItem("ITM008", "Noise-Cancelling Headphones",       "249.99"),
            makeItem("ITM009", "Laptop Stand Adjustable",            "49.99"),
            makeItem("ITM010", "Cable Management Kit",               "24.95")
        ));
    }
}
