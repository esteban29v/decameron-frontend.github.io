<template>
    <div class="container mx-auto py-8">
        <div class="flex items-center justify-center relative mb-6">
            <h1 class="text-3xl font-bold text-center flex-1">Decameron | Lista de Hoteles</h1>
            <button 
                @click="openAddHotelModal()" 
                class="absolute right-0 bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 transition md:px-4 md:py-2 md:font-semibold md:text-base text-lg"
            >
                <span class="hidden md:inline">Agregar Hotel</span>
                <span class="inline md:hidden">+</span>
            </button>
        </div>


        <div class="overflow-x-auto shadow-md rounded-lg">
            <table class="min-w-full table-auto border-collapse">
                <thead>
                    <tr class="bg-gray-200">
                    <th class="py-2 px-4 text-left">Nombre</th>
                    <th class="py-2 px-4 text-left">Ciudad</th>
                    <th class="py-2 px-4 text-left">Número de Habitaciones</th>
                    <th class="py-2 px-4 text-left">Dirección</th>
                    <th class="py-2 px-4 text-left">NIT</th>
                    <th class="py-2 px-4 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="hotel in hotels" :key="hotel.id" class="border-b">
                    <td class="py-2 px-4">{{ hotel.name }}</td>
                    <td class="py-2 px-4">{{ hotel.city }}</td>
                    <td class="py-2 px-4">{{ hotel.number_of_rooms }}</td>
                    <td class="py-2 px-4">{{ hotel.address }}</td>
                    <td class="py-2 px-4">{{ hotel.nit }}</td>
                    <td class="py-2 px-4 flex space-x-2">
                        <!-- Botón para agregar habitaciones -->
                        <button 
                        @click="openAddRoomModal(hotel.id)" 
                        class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                            Añadir Habitaciones
                        </button>

                        <button 
                        @click="openEditHotelModal(hotel.id)" 
                        class="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                            Modificar Hotel
                        </button>

                        <button 
                        @click="openDeteleHotelModal(hotel.id)" 
                        class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                            Eliminar Hotel
                        </button>
                    </td>
                    </tr>
                </tbody>
            </table>

            <!-- MODAL PARA ANADIR HABITACION -->
            <div v-if="showAddRoomModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded shadow-lg w-96">
                    <h2 class="text-xl font-semibold mb-4">{{ hotel.name }} | Agregar Habitaciones</h2>
                    <div v-if="Object.keys(addRoomsErrors).length" class="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
                            <h3 class="font-semibold text-lg">Errores:</h3>
                            <ul class="list-disc ml-6 mt-2">
                                <li v-for="(errorMessages, field) in addRoomsErrors" :key="field" class="text-sm"> {{ errorMessages }}
                                </li>
                            </ul>
                        </div>
                    <form @submit.prevent="submitAddRoom">
                        <!-- Estándar - Sencilla -->
                        <div class="mb-4">
                            <label for="standardSingle" class="block text-sm font-medium">Estándar - Sencilla</label>
                            <input type="number" id="standardSingle" v-model="standard_simple" class="w-full p-2 border rounded mt-2" min="0" name="standard_simple">
                        </div>

                        <!-- Estándar - Doble -->
                        <div class="mb-4">
                            <label for="standardDouble" class="block text-sm font-medium">Estándar - Doble</label>
                            <input type="number" id="standardDouble" v-model="standard_double" class="w-full p-2 border rounded mt-2" min="0" name="standard_double">
                        </div>

                        <!-- Junior - Triple -->
                        <div class="mb-4">
                            <label for="juniorTriple" class="block text-sm font-medium">Junior - Triple</label>
                            <input type="number" id="juniorTriple" v-model="junior_triple" class="w-full p-2 border rounded mt-2" min="0" />
                        </div>

                        <!-- Junior - Cuádruple -->
                        <div class="mb-4">
                            <label for="juniorQuadruple" class="block text-sm font-medium">Junior - Cuádruple</label>
                            <input type="number" id="juniorQuadruple" v-model="junior_quad" class="w-full p-2 border rounded mt-2" min="0" />
                        </div>

                        <!-- Suite - Doble -->
                        <div class="mb-4">
                            <label for="suiteDouble" class="block text-sm font-medium">Suite - Doble</label>
                            <input type="number" id="suiteDouble" v-model="suite_double" class="w-full p-2 border rounded mt-2" min="0" />
                        </div>

                        <!-- Suite - Sencilla -->
                        <div class="mb-4">
                            <label for="suiteSingle" class="block text-sm font-medium">Suite - Sencilla</label>
                            <input type="number" id="suiteSingle" v-model="suite_simple" class="w-full p-2 border rounded mt-2" min="0" />
                        </div>

                        <!-- Suite - Triple -->
                        <div class="mb-4">
                            <label for="suiteTriple" class="block text-sm font-medium">Suite - Triple</label>
                            <input type="number" id="suiteTriple" v-model="suite_triple" class="w-full p-2 border rounded mt-2" min="0" />
                        </div>

                        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 float-right">
                            Guardar
                        </button>
                        <button @click="closeAddRoomModal" class="mt-2 mr-3 text-gray-500 float-right hover:underline">Cerrar</button>
                    </form>
                    
                </div>
            </div>

            <!-- MODAL PARA MODIFICAR HOTEL -->
            <div v-if="showHotelModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded shadow-lg w-96">
                    <h2 class="text-xl font-semibold mb-4">Modificar Hotel</h2>
                    <form @submit.prevent="submitEditHotel">
                        <!-- Nombre del Hotel -->
                        <div class="mb-4">
                            <label for="name" class="block text-sm font-medium">Nombre del Hotel</label>
                            <input type="text" id="name" v-model="hotel.name" class="w-full p-2 border rounded mt-2" required />
                        </div>

                        <!-- Ciudad -->
                        <div class="mb-4">
                            <label for="city" class="block text-sm font-medium">Ciudad</label>
                            <input type="text" id="city" v-model="hotel.city" class="w-full p-2 border rounded mt-2" required />
                        </div>

                        <!-- Número de Habitaciones -->
                        <div class="mb-4">
                            <label for="numberOfRooms" class="block text-sm font-medium">Número de Habitaciones</label>
                            <input type="number" id="numberOfRooms" v-model="hotel.number_of_rooms" class="w-full p-2 border rounded mt-2" min="1" required />
                        </div>

                        <!-- Dirección -->
                        <div class="mb-4">
                            <label for="address" class="block text-sm font-medium">Dirección</label>
                            <input type="text" id="address" v-model="hotel.address" class="w-full p-2 border rounded mt-2" required />
                        </div>

                        <!-- NIT -->
                        <div class="mb-4">
                            <label for="nit" class="block text-sm font-medium">NIT</label>
                            <input type="text" id="nit" v-model="hotel.nit" class="w-full p-2 border rounded mt-2" required />
                        </div>

                        <button type="submit" @click="updateHotel" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 float-right">
                            Guardar
                        </button>
                        <button type="button" @click="closeEditHotelModal" class="mt-2 mr-3 text-gray-500 float-right hover:underline">Cerrar</button>
                    </form>
                </div>
            </div>

            <!-- MODAL PARA ELIMINAR HOTEL -->
            <div v-if="showDeteleHotelModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded shadow-lg w-96">
                    <h2 class="text-xl font-semibold mb-4">Eliminar Hotel</h2>
                    <form @submit.prevent="submitEditHotel">
                        <h2>¿Está seguro de eliminar el hotel?</h2>
                        <br>
                        <button type="submit" @click="deleteHotel" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 float-right">
                            Eliminar
                        </button>
                        <button type="button" @click="closeDeteleHotelModal" class="mt-2 mr-3 text-gray-500 float-right hover:underline">Cerrar</button>
                    </form>
                </div>
            </div>

            <!-- MODAL PARA AGREGAR HOTEL -->
            <div v-if="showAddHotelModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded shadow-lg w-96">
                    <h2 class="text-xl font-semibold mb-4">Añadir Hotel</h2>
                    <form @submit.prevent="">
                        <!-- Nombre del Hotel -->
                        <div class="mb-4">
                            <label for="name" class="block text-sm font-medium">Nombre del Hotel</label>
                            <input type="text" id="name" v-model="hotel.name" class="w-full p-2 border rounded mt-2" required placeholder="Nombre del hotel"/>
                        </div>

                        <!-- Ciudad -->
                        <div class="mb-4">
                            <label for="city" class="block text-sm font-medium">Ciudad</label>
                            <input type="text" id="city" v-model="hotel.city" class="w-full p-2 border rounded mt-2" required placeholder="Ciudad"/>
                        </div>

                        <!-- Número de Habitaciones -->
                        <div class="mb-4">
                            <label for="numberOfRooms" class="block text-sm font-medium">Número de Habitaciones</label>
                            <input type="number" id="numberOfRooms" v-model="hotel.number_of_rooms" class="w-full p-2 border rounded mt-2" min="1" required placeholder="Total de número de habitaciones del hotel"/>
                        </div>

                        <!-- Dirección -->
                        <div class="mb-4">
                            <label for="address" class="block text-sm font-medium">Dirección</label>
                            <input type="text" id="address" v-model="hotel.address" class="w-full p-2 border rounded mt-2" required placeholder="Dirreción del hotel"/>
                        </div>

                        <!-- NIT -->
                        <div class="mb-4">
                            <label for="nit" class="block text-sm font-medium">NIT</label>
                            <input type="text" id="nit" v-model="hotel.nit" class="w-full p-2 border rounded mt-2" required placeholder="NIT del hotel"/>
                        </div>

                        <button type="button" @click="addHotel" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 float-right">
                            Guardar
                        </button>
                        <button type="button" @click="closeAddHotelModal" class="mt-2 mr-3 text-gray-500 float-right hover:underline">Cerrar</button>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="loading" class="text-center mt-4 text-gray-500">
            Cargando hoteles...
        </div>
        <div v-if="error" class="text-center mt-4 text-red-500">
            {{ error }}
        </div>
    </div>
  </template>
  
  <script>
  import api from '../services/api';
  
  export default {
    data() {
      return {
        hotels: [],
        loading: true,
        error: null,
        rooms: Array(7).fill({ number_of_rooms: 0 }),
        hotel: {},
        showHotelModal: false,
        showDeteleHotelModal: false,
        showAddRoomModal: false,
        showAddHotelModal: false,
        hotelId: null,
        addRoomsErrors: {},
        standard_simple: 0,
        standard_double: 0,
        junior_triple: 0,
        junior_quad: 0,
        suite_double: 0,
        suite_simple: 0,
        suite_triple: 0
      };
    },
    watch: {
        async hotelId(newHotelId) {
            try {
                const response = await api.get(`/hotels/${newHotelId}`);
                this.hotel = response.data.data;

                const roomsResponse = await api.get(`/rooms/hotel/${newHotelId}`);

                if (roomsResponse.data.data.length > 0) {
                    this.rooms = roomsResponse.data.data;
                    this.standard_simple = this.rooms.filter(room => room.desc == 'standard_simple')[0].number_of_rooms;
                    this.standard_double = this.rooms.filter(room => room.desc == 'standard_double')[0].number_of_rooms;
                    this.junior_triple = this.rooms.filter(room => room.desc == 'junior_triple')[0].number_of_rooms;
                    this.junior_quad = this.rooms.filter(room => room.desc == 'junior_quad')[0].number_of_rooms;
                    this.suite_double = this.rooms.filter(room => room.desc == 'suite_double')[0].number_of_rooms;
                    this.suite_simple = this.rooms.filter(room => room.desc == 'suite_simple')[0].number_of_rooms;
                    this.suite_triple = this.rooms.filter(room => room.desc == 'suite_triple')[0].number_of_rooms;

                } else {
                    this.rooms = Array(7).fill({ number_of_rooms: 0 });
                }
                
            } catch (error) {
                console.error("Error al obtener los datos del hotel:", error);
            }
        },
    },
    methods: {
        openAddHotelModal() {
            this.hotel = {};
            this.showAddHotelModal = true;
        },

        closeAddHotelModal() {
            this.hotel = {};
            this.showAddHotelModal = false;
        },

        async openEditHotelModal(hotelId) {
            const response = await api.get(`/hotels/${hotelId}`);
            this.hotel = response.data.data;
            this.showHotelModal = true;
            this.hotelId = hotelId;
        },

        closeEditHotelModal() {
            this.hotel = {};
            this.showHotelModal = false;
        },

        openDeteleHotelModal(hotelId) {
            this.showDeteleHotelModal = true;
            this.hotelId = hotelId;
        },

        closeDeteleHotelModal() {
            this.showDeteleHotelModal = false;
        },

        openAddRoomModal(hotelId) {
            this.showAddRoomModal = true;
            this.hotelId = hotelId;
        },

        closeAddRoomModal() {
            this.showAddRoomModal = false;
            this.addRoomsErrors = {};
        },

        async submitAddRoom() {
            try {

                const body = {
                    standard_simple: this.standard_simple,
                    standard_double: this.standard_double,
                    junior_triple: this.junior_triple,
                    junior_quad: this.junior_quad,
                    suite_double: this.suite_double,
                    suite_simple: this.suite_simple,
                    suite_triple: this.suite_triple,
                    hotel_id: this.hotelId
                }

                const response = await api.post(`/rooms/add`, body);
                
                this.fetchHotels();
                this.closeAddRoomModal();
            } catch (error) {
                this.addRoomsErrors = error.response.data.errors;
                console.error('Error al actualizar habitaciones:', error.response.data.errors);
            }

        },
        async updateHotel() {
            try {
                const response = await api.put(`/hotels/${this.hotelId}`, {
                    name: this.hotel.name,
                    city: this.hotel.city,
                    number_of_rooms: this.hotel.number_of_rooms,
                    address: this.hotel.address,
                    nit: this.hotel.nit,
                });
                
                this.fetchHotels();
                this.closeEditHotelModal();
            } catch (error) {
                console.error('Error al actualizar hotel:', error.response.data);
            }
        },
        async fetchHotels() {
            try {
                const response = await api.get('/hotels');
                this.hotels = response.data.data;
            } catch (error) {
                console.error('Error al obtener los hoteles:', error.response.data);
            }
        },
        async deleteHotel() {
            try {
                const response = await api.delete(`/hotels/${this.hotelId}`);
                this.showDeteleHotelModal = false;
                this.fetchHotels();
            } catch (error) {
                console.error('Error al obtener los hoteles:', error.response.data);
            }
        },
        async addHotel() {
            try {
                const response = await api.post(`/hotels`, {
                    name: this.hotel.name,
                    city: this.hotel.city,
                    number_of_rooms: this.hotel.number_of_rooms,
                    address: this.hotel.address,
                    nit: this.hotel.nit,
                });
                
                this.fetchHotels();
                this.closeAddHotelModal();
            } catch (error) {
                console.error('Error al actualizar hotel:', error.response.data);
            }
        }
    },
    async created() {
      try {
        const response = await api.get('/hotels');
        this.hotels = response.data.data;
      } catch (err) {
        this.error = 'Error al cargar los hoteles. Intenta nuevamente.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  };
  </script>
  