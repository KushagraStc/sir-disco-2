#![allow(dead_code)]

pub type Boolean = bool;
pub type Float = f64;
pub type Int = i64;
pub type ID = String;

pub mod input {
    use super::*;
    use serde::Deserialize;

    #[derive(Clone, Debug, Deserialize)]
    #[serde(rename_all(deserialize = "camelCase"))]
    pub struct Input {
        pub discount_node: DiscountNode,
        pub cart: Cart,
    }

    #[derive(Clone, Debug, Deserialize, Default)]
    pub struct DiscountNode {
        pub metafield: Option<Metafield>,
    }

    #[derive(Clone, Debug, Deserialize, Default)]
    #[serde(rename_all(deserialize = "camelCase"))]
    pub struct Metafield {
        pub value: Option<String>,
    }

    // Customer Email
    #[derive(Clone, Debug, Serialize, Deserialize)]
    pub struct Customeremail {
        pub customer_qualifier_email_matchtype: String, 
        pub customer_qualifier_email_matchcondition: String,
        pub email: Vec<String>
    }
    impl Customeremail {
        const fn test(customer_qualifier_email_matchtype: String,customer_qualifier_email_matchcondition: String, email: Vec<String> ) -> Self {
            Customeremail {
                customer_qualifier_email_matchtype,
                customer_qualifier_email_matchcondition,
                email
            }
        }
    }


    // Customer Order
    #[derive(Clone, Debug, Serialize, Deserialize)]
    pub struct Customerorder {
        pub match_condition: String, 
        pub order_count: i64,
       
    }
    impl Customerorder {
        const fn test(match_condition: String,order_count: i64,  ) -> Self {
            Customerorder {
                match_condition,
                order_count,
            }
        }
    }

    // // Customer Total Spend
    #[derive(Clone, Debug, Serialize, Deserialize)]
    pub struct Customertotalspent {
        pub match_condition: String, 
        pub order_count: i64,
    }
    impl Customertotalspent {
        const fn test(match_condition: String,order_count: i64,  ) -> Self {
            Customertotalspent {
                match_condition,
                order_count,   
            }
        }
    }

    // cart amount
    #[derive(Clone, Debug, Serialize, Deserialize)]
    pub struct Cartamount {
        pub customer_qualifier_email_matchtype: String, 
        pub customer_qualifier_email_matchcondition: String,
        pub email: Vec<String>
    }
    impl Cartamount {
        const fn test(customer_qualifier_email_matchtype: String,customer_qualifier_email_matchcondition: String, email: Vec<String> ) -> Self {
            Customeremail {
                customer_qualifier_email_matchtype,
                customer_qualifier_email_matchcondition,
                email
            }
        }
    }

    #[derive(Clone, Debug, Serialize, Deserialize)]
    // #[serde(rename_all = "camelCase")]
    pub struct Configuration {
        pub quantity: i64,
        pub percentage: f64,
        // my items
        // main
        pub name: String,
        pub qualifer_behaviour: String,
        pub maximum_discounts: i64,
        // customer qualifier
        pub customer_qualifier: String,
        pub customer_email: Customeremail,
        pub customer_order: Customerorder,
        pub customer_totalspent: Customertotalspent,
        pub customer_qualifier_all:Vec<String>,
        pub customer_qualifier_any:Vec<String>,
        pub cart_qualifier: String,
        pub cart_amount: 
    }

    impl Configuration {
        const DEFAULT_QUANTITY: i64 = 999;
        const DEFAULT_PERCENTAGE: f64 = 0.0;
        // my items
        // main
        const DEFAULT_NAME: String = String::new();
        const DEFAULT_QUALIFIER_BEHAVIOUR: String = String::new();
        const DEFAULT_MAXIMUM_DISCOUNTS: i64 = 999;
        // customer qualifier
        const DEFAULT_CUSTOMER_QUALIFIER: String = String::new();
        const DEFAULT_CUSTOMER_EMAIL: Customeremail = Customeremail::test(String::new(),String::new(), Vec::new());
        const DEFAULT_CUSTOMER_ORDER: Customerorder = Customerorder::test(String::new(), 0);
        const DEFAULT_CUSTOMER_TOTALSPENT: Customertotalspent = Customertotalspent::test(String::new(),0);
        const DEFAULT_CUSTOMER_QUALIFIER_ALL:  Vec<String> = Vec::new();
        const DEFAULT_CUSTOMER_QUALIFIER_ANY: Vec<String> = Vec::new();
        // cart 
        const DEFAULT_CART_QUALIFIER: String = String::new();

        fn from_str(str: &str) -> Self {
            serde_json::from_str(str).unwrap_or_default()
        }
    }

    impl Default for Configuration {
        fn default() -> Self {
            Configuration {
                quantity: Self::DEFAULT_QUANTITY,
                percentage: Self::DEFAULT_PERCENTAGE,
                // my items
                // main
                name: Self::DEFAULT_NAME,
                qualifer_behaviour: Self::DEFAULT_QUALIFIER_BEHAVIOUR,
                maximum_discounts: Self::DEFAULT_MAXIMUM_DISCOUNTS,
                // customer qualifier
                customer_qualifier: Self::DEFAULT_CUSTOMER_QUALIFIER,
                customer_email: Self::DEFAULT_CUSTOMER_EMAIL,
                customer_order: Self::DEFAULT_CUSTOMER_ORDER,
                customer_totalspent: Self::DEFAULT_CUSTOMER_TOTALSPENT,
                customer_qualifier_all: Self::DEFAULT_CUSTOMER_QUALIFIER_ALL,
                customer_qualifier_any:Self::DEFAULT_CUSTOMER_QUALIFIER_ANY,

                // cart
                cart_qualifier: Self::DEFAULT_CART_QUALIFIER,
            }
        }
    }

    impl input::Input {
        pub fn configuration(&self) -> Configuration {
            let value: Option<&str> = self
                .discount_node
                .metafield
                .as_ref()
                .and_then(|metafield| metafield.value.as_deref());
            value.map(Configuration::from_str).unwrap_or_default()
        }
    }

    #[derive(Clone, Debug, Deserialize)]
    pub struct Cart {
        pub lines: Vec<CartLine>,
    }

    #[derive(Clone, Debug, Deserialize)]
    pub struct CartLine {
        pub quantity: Int,
        pub merchandise: Merchandise,
    }

    #[derive(Clone, Debug, Deserialize)]
    pub struct Merchandise {
        pub id: Option<ID>,
    }
}

use serde::Serialize;
use serde_with::skip_serializing_none;

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct FunctionResult {
    pub discount_application_strategy: DiscountApplicationStrategy,
    pub discounts: Vec<Discount>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "SCREAMING_SNAKE_CASE"))]
pub enum DiscountApplicationStrategy {
    First,
    Maximum,
}

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize)]
pub struct Discount {
    pub value: Value,
    pub targets: Vec<Target>,
    pub message: Option<String>,
    pub conditions: Option<Vec<Condition>>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub enum Value {
    FixedAmount(FixedAmount),
    Percentage(Percentage),
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct FixedAmount {
    pub applies_to_each_item: Option<Boolean>,
    pub value: Float,
}

#[derive(Clone, Debug, Serialize)]
pub struct Percentage {
    pub value: Float,
}

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub enum Target {
    ProductVariant { id: ID, quantity: Option<Int> },
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub enum Condition {
    #[serde(rename_all(serialize = "camelCase"))]
    ProductMinimumQuantity {
        ids: Vec<ID>,
        minimum_quantity: Int,
        target_type: ConditionTargetType,
    },
    #[serde(rename_all(serialize = "camelCase"))]
    ProductMinimumSubtotal {
        ids: Vec<ID>,
        minimum_amount: Float,
        target_type: ConditionTargetType,
    },
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "SCREAMING_SNAKE_CASE"))]
pub enum ConditionTargetType {
    ProductVariant,
}
