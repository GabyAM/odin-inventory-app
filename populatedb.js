/* eslint camelcase: 0 */

const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');
const Brand = require('./models/brand');

const items = [];
const categories = [];
const brands = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log('Debug: About to connect');
    await mongoose.connect(mongoDB);
    console.log('Debug: Should be connected?');

    await createBrands();
    await createCategories();
    await createItems();

    console.log('Debug: Closing mongoose');
    mongoose.connection.close();
}

async function itemCreate(
    index,
    name,
    description,
    brand,
    price,
    stock,
    category
) {
    const itemDetail = {
        name,
        brand,
        price,
        stock,
        category
    };
    if (description) {
        itemDetail.description = description;
    }

    const item = new Item(itemDetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${item}`);
}

async function categoryCreate(index, name, description) {
    const categoryDetail = { name };
    if (description) {
        categoryDetail.description = description;
    }

    const category = new Category(categoryDetail);
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${category}`);
}

async function brandCreate(index, name, foundation_date) {
    const brandDetail = { name };
    if (foundation_date) {
        brandDetail.foundation_date = foundation_date;
    }

    const brand = new Brand(brandDetail);
    await brand.save();
    brands[index] = brand;
    console.log(`Added category: ${brand}`);
}

async function createBrands() {
    console.log('adding brands');
    await Promise.all([
        brandCreate(0, 'AMD', '1969-05-01'),
        brandCreate(1, 'Intel', '1968-07-18'),
        brandCreate(2, 'Asus', '1989-04-02'),
        brandCreate(3, 'Corsair', '1994-01-01'),
        brandCreate(4, 'Kingston', '1987-10-17'),
        brandCreate(5, 'Gigabyte', '1986-01-01'),
        brandCreate(6, 'Logitech', '1981-01-01'),
        brandCreate(7, 'Nvidia GeForce', '1999-01-01'),
        brandCreate(8, 'Razer', '1998-01-01')
    ]);
}

async function createCategories() {
    console.log('adding categories');
    await Promise.all([
        categoryCreate(
            0,
            'Processors',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        categoryCreate(
            1,
            'Graphics cards',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        categoryCreate(
            2,
            'RAMs',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        categoryCreate(
            3,
            'Motherboards',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        categoryCreate(
            4,
            'Disks',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        categoryCreate(
            5,
            'Power supplies',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        categoryCreate(
            6,
            'Mouses',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        categoryCreate(
            7,
            'Keyboards',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        )
    ]);
}

async function createItems() {
    console.log('adding items');
    await Promise.all([
        itemCreate(
            0,
            'AMD Ryzen 7 8700G',
            '',
            brands[0],
            330,
            6,
            categories[0]
        ),
        itemCreate(1, 'AMD Ryzen 5 2400G', '', brands[0], 60, 4, categories[0]),
        itemCreate(
            2,
            'Intel core i9 14900T',
            '',
            brands[1],
            550,
            9,
            categories[0]
        ),
        itemCreate(
            3,
            'Intel core i3 6100',
            '',
            brands[1],
            100,
            3,
            categories[0]
        ),
        itemCreate(
            4,
            'Intel core i5 8500',
            '',
            brands[1],
            220,
            4,
            categories[0]
        ),
        itemCreate(
            5,
            'Radeon RX 6900 XT',
            '',
            brands[0],
            700,
            8,
            categories[1]
        ),
        itemCreate(
            6,
            'GeForce GTX 1660 Super',
            '',
            brands[7],
            250,
            8,
            categories[1]
        ),
        itemCreate(
            7,
            'Kingston FURY Renegade Pro DDR5 RDIMM Memory',
            '',
            brands[4],
            70,
            5,
            categories[2]
        ),
        itemCreate(
            8,
            'Kingston FURY Beast DDR4 RGB Memory',
            '',
            brands[4],
            50,
            7,
            categories[2]
        ),
        itemCreate(
            9,
            'Logitech G203 LightSync',
            '',
            brands[6],
            30,
            12,
            categories[6]
        ),
        itemCreate(
            10,
            'Razer DeathAdder Essential',
            '',
            brands[8],
            30,
            8,
            categories[6]
        )
    ]);
}
