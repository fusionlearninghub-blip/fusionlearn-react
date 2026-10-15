import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GOALS, type Profile as ProfileData } from "../types";
import { useLearning } from "../state/LearningContext";
import { useToast } from "../state/ToastContext";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  email: z.string().trim().min(1, "Please enter your email").pipe(z.email("Please enter a valid email address")),
  goal: z.enum(GOALS),
});

export default function Profile() {
  const { state, dispatch } = useLearning();
  const toast = useToast();
  const { profile } = state;
  const [initial] = useState<ProfileData>(profile);

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<ProfileData>({ resolver: zodResolver(profileSchema), defaultValues: initial });

  return (
    <>
      <section className="page-header">
        <p className="section-label">ACCOUNT</p>
        <h1>My Profile</h1>
        <p>Manage your FusionLearn profile.</p>
      </section>

      <section className="profile-layout">
        <div className="profile-card">
          <div className="avatar">
            <span>{profile.name.trim().charAt(0).toUpperCase()}</span>
          </div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <p className="profile-role">Student</p>
        </div>

        <div className="content-card">
          <p className="section-label">PERSONAL INFORMATION</p>
          <h2>Edit Profile</h2>
          <form
            noValidate
            onSubmit={handleSubmit((values) => {
              dispatch({ type: "updateProfile", profile: values });
              toast("Profile updated successfully!");
            })}
          >
            <div className="form-group">
              <label htmlFor="nameInput">Full Name</label>
              <input
                id="nameInput"
                type="text"
                placeholder="Enter your name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
              {errors.name && <p className="field-error" id="name-error" role="alert">{errors.name.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="emailInput">Email</label>
              <input
                id="emailInput"
                type="email"
                placeholder="Enter your email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && <p className="field-error" id="email-error" role="alert">{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="goalInput">Learning Goal</label>
              <select id="goalInput" {...register("goal")}>
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn primary">Save Changes</button>
          </form>
        </div>
      </section>
    </>
  );
}
