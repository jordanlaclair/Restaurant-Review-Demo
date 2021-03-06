import React, { useEffect } from "react";
import RestaurantsFinder from "../../apis/RestaurantsFinder";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import StarRating from "../StarRating/StarRating";
import * as action from "../../store/actions/index";
import "./RestaurantList.scss";

const RestaurantList = () => {
	//const { restaurants, setRestaurants } = useContext(RestaurantsContext);
	//state.restaurants is a set of state in our store, state.restaurants.restaurants are the actual restaurants
	const restaurants = useSelector((state) => state.restaurants.restaurants);
	//console.log(restaurants);
	const dispatch = useDispatch();

	let history = useHistory();
	useEffect(() => {
		try {
			async function fetchData() {
				const response = await RestaurantsFinder.get("/");
				//console.log(response.data.data.restaurants);

				//setRestaurants(response.data.data.restaurants);
				dispatch(action.setRestaurants(response.data.data.restaurants));
			}
			fetchData();
		} catch (error) {
			console.error(error);
		}
	}, []);

	const handleDelete = async (e, id) => {
		e.stopPropagation();

		try {
			const response = await RestaurantsFinder.delete(`/${id}`);
			//dispatch(action.removeRestaurant(id));

			/* setRestaurants(
				restaurants.filter((restaurant) => {
					return restaurant.id !== id;
				})
			); */
			console.log(id);
			dispatch(action.removeRestaurant(id));
			//console.log(response);
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdate = (e, id) => {
		e.stopPropagation();
		history.push(`/restaurants/${id}/update`);
	};

	const handleRestaurantSelect = (id) => {
		history.push(`/restaurants/${id}`);
	};

	const renderRating = (restaurant) => {
		if (!restaurant.count) {
			return <span className="text-warning">0 Reviews</span>;
		}
		return (
			<div className="ratings__wrapper">
				<StarRating rating={restaurant.average_rating} />
				<div className="text-warning ml-1"> &nbsp; ({restaurant.count})</div>
			</div>
		);
	};

	return (
		<div className="container d-flex justify-content-center align-items-center">
			{restaurants.length == 0 ? (
				<div className="d-flex flex-column justify-content-center align-items-center mt-5">
					<h1 className="text-center">Sorry! No restaurants were found!</h1>
					<div
						className="spinner-border mt-5"
						role="status"
						style={{ width: "3rem", height: "3rem" }}
					>
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			) : (
				<div className="table table-responsive-sm table__wrapper">
					<table className="table table-hover table-striped table-secondary">
						<thead className="table-dark">
							<tr>
								<th scope="col">Restaurant</th>
								<th scope="col">Location</th>
								<th scope="col">Price Range</th>
								<th scope="col">Ratings</th>
								<th scope="col">Edit</th>
								<th scope="col">Delete</th>
							</tr>
						</thead>
						<tbody>
							{restaurants &&
								restaurants.map((restaurant) => {
									return (
										<tr
											onClick={() => {
												handleRestaurantSelect(restaurant.id);
											}}
											key={restaurant.id}
											className="--cursor-pointer"
										>
											<th scope="row">{restaurant.name}</th>
											<td className="fw-bold">{restaurant.location}</td>
											<td className="fw-bold">
												{"$".repeat(restaurant.price_range)}
											</td>
											<td className="fw-bold">{renderRating(restaurant)}</td>
											<td>
												<button
													onClick={(e) => {
														handleUpdate(e, restaurant.id);
													}}
													className="btn btn-primary"
												>
													Update
												</button>
											</td>
											<td>
												<button
													onClick={(e) => {
														handleDelete(e, restaurant.id);
													}}
													className="btn btn-danger"
												>
													Delete
												</button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default RestaurantList;
