import {
  addressFilteredMarketItem,
  fetchMarketItems,
  filterClear,
  filterUpdated,
  // getAllTagsTerms,
} from "../../redux/slice/marketSlice";
import {
  marketItemSortBySortKey,
  marketItemSortBySortKeyItem,
  marketItemSortBySortKeyRental,
  marketItemSortBySortKeyVehicle,
} from "./marketQueries";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

export function marketItemFilterUpdate(props, dispatch) {
  const {
    type,
    name = "",
    category = [],
    condition = [],
    min = "",
    max = "",
    minYear = "",
    maxYear = "",
    make = [],
    model = [],
    vehicleType = [],
    marketRentalSaleRent = [],
    propertyType = [],
    airConditioningType = [],
    heatingType = [],
    tags = [],
    searchRadius = "",
  } = props;
  const addressInfo = { lat: 42.2732, lng: -83.0014 };
  const filter = {};
  (min !== "" || max !== "") &&
    Object.assign(filter, {
      price: {
        between: [min === "" ? 0 : min, max === "" ? 999999 : max],
      },
    });
  (minYear !== "" || maxYear !== "") &&
    Object.assign(filter, {
      year: {
        between: [
          minYear === "" ? 0 : minYear,
          maxYear === "" ? 999999 : maxYear,
        ],
      },
    });
  // {marketItemCategory:{eq:category[]}}
  let itemFilter = [];
  //conversion: Latitude: 1 deg = 110.574 km
  // Longitude: 1 deg = 111.320*cos(latitude) km
  searchRadius.length !== 0 &&
    itemFilter.push({
      lat: {
        between: [
          addressInfo.lat - searchRadius / 110.574,
          addressInfo.lat + searchRadius / 110.574,
        ],
      },
      lng: {
        between: [
          addressInfo.lng -
            searchRadius / Math.abs(111.32 * Math.cos(addressInfo.lat)),
          addressInfo.lng +
            searchRadius / Math.abs(111.32 * Math.cos(addressInfo.lat)),
        ],
      },
    });

  name.length !== 0 &&
    itemFilter.push(
      { name: { contains: name } },
      { description: { contains: name } }
    );
  category.length !== 0 &&
    category.map((c) => itemFilter.push({ marketItemCategory: { eq: c } }));
  condition.length !== 0 &&
    condition.map((c) => itemFilter.push({ marketItemCondition: { eq: c } }));
  make.length !== 0 && make.map((c) => itemFilter.push({ make: { eq: c } }));
  model.length !== 0 && model.map((c) => itemFilter.push({ model: { eq: c } }));
  vehicleType.length !== 0 &&
    vehicleType.map((c) => itemFilter.push({ vehicleType: { eq: c } }));
  marketRentalSaleRent.length !== 0 &&
    marketRentalSaleRent.map((c) =>
      itemFilter.push({ marketRentalSaleRent: { eq: c } })
    );
  propertyType.length !== 0 &&
    propertyType.map((c) => itemFilter.push({ propertyType: { eq: c } }));
  airConditioningType.length !== 0 &&
    airConditioningType.map((c) =>
      itemFilter.push({ airConditioningType: { eq: c } })
    );
  heatingType.length !== 0 &&
    heatingType.map((c) => itemFilter.push({ heatingType: { eq: c } }));
  tags.length !== 0
    ? tags.map((c) => itemFilter.push({ tags: { contains: c } }))
    : itemFilter.map((item) => Object.keys(item) !== tags);
  itemFilter.length !== 0 && Object.assign(filter, { active: { eq: true } });
  itemFilter.length !== 0
    ? Object.assign(filter, { or: itemFilter })
    : dispatch(filterClear());
  dispatch(filterUpdated({ marketType: type, filter: filter }));
}

export default function useMarketItemFilter(filterList, type) {
  const dispatch = useDispatch();
  const [isFiltering, setIsFiltering] = useState(false);
  const { filter, fetchStatus } = useSelector((state) => state.market);
  const query =
    type === "Item"
      ? marketItemSortBySortKeyItem
      : type === "Vehicle"
      ? marketItemSortBySortKeyVehicle
      : type === "Rental"
      ? marketItemSortBySortKeyRental
      : type === "all"
      ? marketItemSortBySortKey
      : null;

  console.log(filter);
  useEffect(() => {
    if (fetchStatus) {
      if (type === "all") {
        if (Object.keys(filter).length === 0) {
          setIsFiltering(false);
          // dispatch(getAllTagsTerms({ filter: { active: { eq: true } } }));
          dispatch(
            fetchMarketItems({
              query: marketItemSortBySortKey,
              marketType: type,
            })
          );
        } else if (
          Object.keys(Object.values(filter)[0][0]).includes("name") ||
          Object.keys(Object.values(filter)[0][0]).includes("tags")
        ) {
          setIsFiltering(true);
          dispatch(
            fetchMarketItems({
              query: marketItemSortBySortKey,
              filter: filter,
              marketType: type,
            })
          );
        } else {
          setIsFiltering(true);
          dispatch(addressFilteredMarketItem({ filter }));
        }
      } else {
        // dispatch(getAllTagsTerms({ filter: { marketType: { eq: type } } }));
        if (Object.keys(filter).length === 0) {
          setIsFiltering(false);
          dispatch(
            fetchMarketItems({
              query: query,
              // filter: { marketType: { eq: type } },
              marketType: type,
            })
          );
        } else {
          setIsFiltering(true);
          // filter["marketType"] = { eq: type };
          dispatch(
            fetchMarketItems({ query: query, filter, marketType: type })
          );
        }
      }
      // setStarter(false);
    }
  }, [filter, type, dispatch, query, fetchStatus]);
  return isFiltering;
}

// eslint-disable-next-line react-hooks/exhaustive-deps
