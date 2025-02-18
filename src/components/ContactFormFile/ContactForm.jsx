import { Formik, Form, Field, ErrorMessage } from "formik";
import { nanoid } from "nanoid";
import * as Yup from "yup";
import MaskedInput from "react-text-mask";
import styles from "./ContactForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addContact, selectContacts } from "../../redux/contactsSlice";

const FeedBackSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Wpisałeś za mało znaków")
    .max(50, "Wpisałeś za dużo znaków")
    .transform((value) => {
      return value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    })
    .required("Pole obawiązkowe"),
  number: Yup.string()
    .matches(
      /^\d{3}-\d{2}-\d{2}$/,
      "Numer telefonu musi być w formacie: 111-11-11"
    )
    .required("Pole obawiązkowe"),
});

const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  console.log("Contacts in contact form:", contacts);

  const initialValues = {
    name: "",
    number: "",
  };

  const handleSubmit = (values, actions) => {
    const newContact = {
      ...values,
      id: nanoid(),
    };

    const isDuplicate = contacts.some(
      (contact) => contact.name.toLowerCase() === newContact.name.toLowerCase()
    );

    if (isDuplicate) {
      alert(`${newContact.name} jest już w kontaktach!`);
      return;
    }

    dispatch(addContact(newContact));
    actions.resetForm();
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={FeedBackSchema}
      >
        {({ setFieldValue }) => (
          <Form className={styles.form}>
            <label className={styles.label} htmlFor="name">
              Wpisz imię i nazwisko
            </label>
            <Field
              className={styles.input}
              type="text"
              name="name"
              onChange={(e) => {
                const value = e.target.value
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");
                setFieldValue("name", value);
              }}
              placeholder="Wpisz imię i nazwisko"
            />
            <ErrorMessage
              name="name"
              component="span"
              className={styles.error}
            />
            <label className={styles.label} htmlFor="number">
              Wpisz numer telefonu
            </label>
            <Field className={styles.input} name="number">
              {({ field }) => (
                <MaskedInput
                  {...field}
                  mask={[/\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/]}
                  placeholder="111-11-11"
                  className={styles.input}
                />
              )}
            </Field>
            <ErrorMessage
              name="number"
              component="span"
              className={styles.error}
            />
            <button className={styles.button} type="submit">
              Dodaj kontakt
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
