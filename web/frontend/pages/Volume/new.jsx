import { useForm, useField } from "@shopify/react-form";
import { CurrencyCode } from "@shopify/react-i18n";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  ActiveDatesCard,
  CombinationCard,
  DiscountClass,
  DiscountMethod,
  MethodCard,
  DiscountStatus,
  RequirementType,
  SummaryCard,
  UsageLimitsCard,
  onBreadcrumbAction,
} from "@shopify/discount-app-components";
import {
  Banner,
  Card,
  Layout,
  Page,
  TextField,
  Stack,
  PageActions,
} from "@shopify/polaris";

import metafields from '../../metafields'
import { useAuthenticatedFetch } from "../../hooks";


const todaysDate = new Date();
const FUNCTION_ID = "01GM2Y5Y7D9ZN90T96S0E7P3J3";

export default function VolumeNew() {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const currencyCode = CurrencyCode.Cad;
  const authenticatedFetch = useAuthenticatedFetch();

  const {
    fields: {
      discountTitle,
      discountCode,
      discountMethod,
      combinesWith,
      requirementType,
      requirementSubtotal,
      requirementQuantity,
      usageTotalLimit,
      usageOncePerCustomer,
      startDate,
      endDate,
      configuration,
    },
    submit,
    submitting,
    dirty,
    reset,
    submitErrors,
    makeClean,
  } = useForm({
    fields: {
      discountTitle: useField(""),
      discountMethod: useField(DiscountMethod.Code),
      discountCode: useField(""),
      combinesWith: useField({
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: false,
      }),
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      usageTotalLimit: useField(null),
      usageOncePerCustomer: useField(false),
      startDate: useField(todaysDate),
      endDate: useField(null),
      configuration: {
        // Add quantity and percentage configuration
        quantity: useField("1"),
        percentage: useField("0"),
      },
    },
    onSubmit: async (form) => {
      const discount = {
        functionId: FUNCTION_ID,
        combinesWith: form.combinesWith,
        startsAt: form.startDate,
        endsAt: form.endDate,
        metafields: [
          {
            namespace: metafields.namespace,
            key: metafields.key,
            type: 'json',
            value: JSON.stringify({
              quantity: parseInt(form.configuration.quantity),
              percentage: parseFloat(form.configuration.percentage),
              name: "STC-123",
              qualifer_behaviour: "all",
              maximum_discounts: 10,
              customer_qualifier: "all",
              customer_email: {
                customer_qualifier_email_matchtype: "does",
                customer_qualifier_email_matchcondition: "match",
                email: ["test@123", "test@677"],
              },
              customer_order: {
                match_condition: "greater_than",
                order_count: 0,
              },
              customer_totalspent: {
                match_condition: "greater_than",
                order_count: 0,
              },
              customer_qualifier_all:["customer_email", "customer_order", "customer_totalspent"],
              customer_qualifier_any:["customer_email", "customer_order"],
              // maximumdiscounts: 5,
              // customerqualifier:"customer_email",
              // cartQualifier:"",
              // discountedItemSelector:"",
              // discountToApply:"",
            }),
            // value: JSON.stringify({
            //   quantity: parseInt(form.configuration.quantity),
            //   percentage: parseFloat(form.configuration.percentage),
            //   name: "STC-123",
            //   qualiferBehaviour: "all",
            //   MaximumDiscounts: 5,
            //   customerQualifier: "customer_email",
            //   discountToApply: "percentage",
            //   discountedItemSelector: "none",
            //   // customer start
            //   customer_email: {
            //     matchType: "does",
            //     matchCondition: "match_one",
            //     emails: ["1@email.com", "2@email.com"],
            //   },
            //   customer_tag: {
            //     matchType: "does",
            //     matchCondition: "match",
            //     tags: [],
            //   },
            //   customer_order: {
            //     matchCondition: "greater_than",
            //     orderCount: "0",
            //   },
            //   customer_totalSpent: {
            //     matchCondition: "greater_than",
            //     orderCount: "0",
            //   },
            //   customer_acceptMarket: {
            //     acceptsMarketing: "does_accept",
            //   },
            //   customer_all: {},
            //   customer_any: {},
            //   // cart end 
            //   // discount start 
            //   discount_percentage: {
            //     percentage: 50,
            //     message: "TestMessageDiscount"
            //   },
            //   discount_fixed: {
            //     amount: "",
            //     message: "",
            //     behaviour: "",
            //   },
            //   discount_fixedItem: {
            //     amount: "",
            //     message: "",
            //   },
            //   discount_tax: {
            //     amount: "",
            //     message: "",
            //   },
            //   // discount  end
            //   // discount item start
            //   discount_item_productid: {
            //     matchCondition: "is_one",
            //     productid: [],
            //   },
            //   discount_item_productvendor: {
            //     matchCondition: "is_one",
            //     productvendor: [],
            //   },
            //   discount_item_producttype: {
            //     matchCondition: "is_one",
            //     productType: [],
            //   },
            //   discount_item_producttag: {
            //     matchType: "does",
            //     matchCondition: "match",
            //     tag: [],
            //   },
            //   discount_item_variantsku: {
            //     matchType: "does",
            //     matchCondition: "match",
            //     variantsku: [],
            //   },
            //   discount_item_variantid: {
            //     matchCondition: "is_one",
            //     variantid: [],
            //   },
            //   discount_item_properties: {
            //     properties: []
            //   },
            //   discount_item_lineitemprice: {
            //     matchCondition: "greater_than_equal",
            //     amount: "",
            //   },
            //   discount_item_GiftCard: {
            //     matchCondition: "no",
            //   },
            //   discount_item_SaleItem: {
            //     matchCondition: "no",
            //   },
            //   discount_item_discounted: {
            //     matchCondition: "no",
            //   },
            //   discount_item_SubscriptionItem: {
            //     matchCondition: "no"
            //   },
            //   discountedItemSelector_And: [],
            //   discountedItemSelector_Or: [],
            //   // discount item end
            //   // cart start 
            //   cartQualifier: "CartQuantityQualifier",
            //   cart_quantity: {
            //     total: "cart",
            //     amount: "",
            //     condition: "greater_than",
            //   },
            //   cart_amount: {
            //     behaviour: "cart",
            //     condition: "greater_than",
            //     amount: "",
            //   },
            //   cart_item: {
            //     quantity: "quantity",
            //     condition: "greater_than",
            //     amount: "",
            //     itemSelector: "cart_productid",
            //   },
            //   cart_item_productid: {
            //     matchCondition: "is_one",
            //     productid: []
            //   },
            //   cart_item_productvendor: {
            //     matchCondition: "is_one",
            //     productvendor: []
            //   },
            //   cart_item_producttype: {
            //     matchCondition: "is_one",
            //     producttype: []
            //   },
            //   cart_item_producttag: {
            //     matchCondition: "is_one",
            //     producttag: []
            //   },
            //   cart_item_variantsku: {
            //     matchType: "does",
            //     matchCondition: "match",
            //     variantsku: [],
            //   },
            //   cart_item_variantid: {
            //     matchCondition: "is_one",
            //     variantid: []
            //   },
            //   cart_item_properties: {
            //     properties: []
            //   },
            //   cart_item_price: {
            //     amount: "",
            //     matchCondition: "greater_than_equal",
            //   },
            //   cart_item_giftcard: {
            //     matchCondition: "no"
            //   },
            //   cart_item_saleitem: {
            //     matchCondition: "no"
            //   },
            //   cart_item_reduceditem: {
            //     matchCondition: "no"
            //   },
            //   cart_item_subscriptionitem: {
            //     matchCondition: "no"
            //   },
            //   cart_weight: {
            //     condition: "greater_than",
            //     amount: "",
            //     unit: "",
            //   },
            //   cart_hasdiscount: {
            //     matchType: "does",
            //     matchCondition: "match",
            //     hasdiscount: [],
            //   },
            //   cart_countryprovince: {
            //     matchCondition: "is_one",
            //     matchtype: "is_one",
            //     countryprovince: []
            //   },
            //   cart_countrycode: {
            //     CountryCode: [],
            //   },
            //   cart_zipcode: {
            //     matchType: "does",
            //     matchCondition: "match",
            //     zipCode: [],
            //   },
            //   cart_fulladdr: {
            //     address: []
            //   },
            //   cart_reducedcartamt: {
            //     condition: "greater_than",
            //     amount: "",
            //   },
            //   cart_LocaleQualifier: {
            //     matchType: "does",
            //     condition: "match",
            //   },
            //   cart_exludediscount: {
            //     behaviour: "apply_discount",
            //     message: "apply_discount",
            //     matchBehaviour: "reject_except",
            //     excludediscount: []
            //   },
            //   cart_or: [],
            //   cart_and: []
            //   // discountedItemSelector_variant_sku: [],
            //   // cartQualifierSelector_PostCartAmount_Condition: "greater_than",
            //   // cartQualifierSelector_PostCartAmount_Match: "",
            //   // cart end
            // }),
          },
        ],
      };

      let response;
      if (form.discountMethod === DiscountMethod.Automatic) {
        response = await authenticatedFetch("/api/discounts/automatic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: {
              ...discount,
              title: form.discountTitle,
            },
          }),
        });
      } else {
        response = await authenticatedFetch("/api/discounts/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: {
              ...discount,
              title: form.discountCode,
              code: form.discountCode,
            },
          }),
        });
      }

      const {
        errors, // errors like missing scope access
        data
      } = await response.json();

      const remoteErrors = errors || data?.discountCreate?.userErrors;

      if (remoteErrors?.length > 0) {
        return { status: "fail", errors: remoteErrors };
      }

      redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
        name: Redirect.ResourceType.Discount,
      });

      return { status: "success" };
    },
  });

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        <Banner status="critical">
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(({ message }, index) => {
              return <li key={`${message}${index}`}>{message}</li>;
            })}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null;

  return (
    <Page
      title="Create volume discount"
      breadcrumbs={[
        {
          content: "Discounts",
          onAction: () => onBreadcrumbAction(redirect, true),
        },
      ]}
      primaryAction={{
        content: "Save",
        onAction: submit,
        disabled: !dirty,
        loading: submitting,
      }}
    >
      <Layout>
        {errorBanner}
        <Layout.Section>
          <form onSubmit={submit}>
            <MethodCard
              title="Volume"
              discountTitle={discountTitle}
              discountClass={DiscountClass.Product}
              discountCode={discountCode}
              discountMethod={discountMethod}
            />
            <Card title="Volume">
              <Card.Section>
                <Stack>
                  <TextField
                    label="Minimum quantity"
                    {...configuration.quantity}
                  />
                  <TextField
                    label="Discount percentage"
                    {...configuration.percentage}
                    suffix="%"
                  />
                </Stack>
              </Card.Section>
            </Card>
            {discountMethod.value === DiscountMethod.Code && (
              <UsageLimitsCard
                totalUsageLimit={usageTotalLimit}
                oncePerCustomer={usageOncePerCustomer}
              />
            )}
            <CombinationCard
              combinableDiscountTypes={combinesWith}
              discountClass={DiscountClass.Product}
              discountDescriptor={
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value
              }
            />
            <ActiveDatesCard
              startDate={startDate}
              endDate={endDate}
              timezoneAbbreviation="EST"
            />
          </form>
        </Layout.Section>
        <Layout.Section secondary>
          <SummaryCard
            header={{
              discountMethod: discountMethod.value,
              discountDescriptor:
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value,
              appDiscountType: "Volume",
              isEditing: false,
            }}
            performance={{
              status: DiscountStatus.Scheduled,
              usageCount: 0,
            }}
            minimumRequirements={{
              requirementType: requirementType.value,
              subtotal: requirementSubtotal.value,
              quantity: requirementQuantity.value,
              currencyCode: currencyCode,
            }}
            usageLimits={{
              oncePerCustomer: usageOncePerCustomer.value,
              totalUsageLimit: usageTotalLimit.value,
            }}
            activeDates={{
              startDate: startDate.value,
              endDate: endDate.value,
            }}
          />
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save discount",
              onAction: submit,
              disabled: !dirty,
              loading: submitting,
            }}
            secondaryActions={[
              {
                content: "Discard",
                onAction: () => onBreadcrumbAction(redirect, true),
              },
            ]}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
