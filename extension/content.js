// Field Aliases dictionary tailored for law firm career portals & Google forms
const FIELD_ALIASES = {
  fullName: [
    'fullname', 'full_name', 'name', 'candidate_name', 'applicant_name', 'your_name',
    'legal_name', 'first_name', 'fname', 'student_name', 'name_of_applicant'
  ],
  email: [
    'email', 'e-mail', 'candidate_email', 'applicant_email', 'your_email', 'mail', 'email_address'
  ],
  phone: [
    'phone', 'mobile', 'contact', 'contact_number', 'phone_number', 'mobile_number',
    'cell', 'telephone', 'whatsapp', 'whatsapp_number'
  ],
  college: [
    'college', 'university', 'institution', 'law_school', 'school', 'name_of_college',
    'college_name', 'university_name', 'educational_institution', 'academic_institution'
  ],
  degree: [
    'degree', 'course', 'qualification', 'programme', 'program', 'degree_course',
    'stream', 'law_course'
  ],
  yearOfStudy: [
    'year_of_study', 'year', 'current_year', 'batch', 'class_year', 'academic_year',
    'study_year', 'semester'
  ],
  passingYear: [
    'passing_year', 'graduation_year', 'year_of_passing', 'year_of_completion',
    'qualifying_year', 'expected_graduation'
  ],
  cgpa: [
    'cgpa', 'gpa', 'percentage', 'marks', 'score', 'grades', 'grade_point',
    'aggregate_marks', 'rank', 'class_rank'
  ],
  preferredPractice: [
    'practice_area', 'preferred_practice', 'area_of_interest', 'domain', 'department',
    'specialization', 'preferred_department', 'practice_group', 'area_of_law'
  ],
  preferredLocation: [
    'location', 'office', 'preferred_location', 'preferred_office', 'branch',
    'preferred_city', 'city_preference'
  ],
  availability: [
    'availability', 'preferred_month', 'internship_duration', 'duration', 'month',
    'preferred_dates', 'start_date', 'period_of_internship', 'months_preferred'
  ],
  linkedIn: [
    'linkedin', 'linkedin_url', 'profile_link', 'linkedin_profile', 'social_profile'
  ],
  coverLetter: [
    'cover_letter', 'sop', 'statement_of_purpose', 'statement', 'message',
    'why_should_we_hire_you', 'about_yourself', 'brief_introduction', 'comments',
    'additional_information', 'why_join'
  ],
  achievements: [
    'achievements', 'moots', 'publications', 'experience', 'prior_internships',
    'academic_achievements', 'extra_curricular'
  ]
};

// Dispatch change & input events so dynamic form engines (React, Vue, Angular, Elementor, WPForms) recognize the input
function triggerInputEvents(element, value) {
  element.focus();
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));

  // Add a pleasant visual cue (emerald border highlight)
  element.style.outline = '2px solid #10b981';
  element.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
  element.style.transition = 'all 0.3s ease';
}

function matchFieldCategory(fieldName, placeholder, labelText) {
  const combined = `${fieldName} ${placeholder} ${labelText}`.toLowerCase().replace(/[^a-z0-9_]/g, ' ');

  for (const [category, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const alias of aliases) {
      const formattedAlias = alias.replace(/_/g, ' ');
      if (combined.includes(alias) || combined.includes(formattedAlias)) {
        return category;
      }
    }
  }
  return null;
}

function getLabelForInput(element) {
  // Check id
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.innerText;
  }
  // Check parent label
  const parentLabel = element.closest('label');
  if (parentLabel) return parentLabel.innerText;

  // Check aria-label
  if (element.getAttribute('aria-label')) return element.getAttribute('aria-label');

  // Check preceding sibling or header
  const prev = element.previousElementSibling;
  if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'SPAN' || prev.tagName === 'P')) {
    return prev.innerText;
  }

  return '';
}

// Perform Autofill on active tab
function autofillForm(profile) {
  let filledCount = 0;
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');

  inputs.forEach(input => {
    const name = input.name || '';
    const id = input.id || '';
    const placeholder = input.placeholder || '';
    const labelText = getLabelForInput(input);

    const category = matchFieldCategory(`${name} ${id}`, placeholder, labelText);
    if (!category) return;

    let valueToFill = '';
    switch (category) {
      case 'fullName':
        valueToFill = profile.fullName;
        break;
      case 'email':
        valueToFill = profile.email;
        break;
      case 'phone':
        valueToFill = profile.phone;
        break;
      case 'college':
        valueToFill = profile.college;
        break;
      case 'degree':
        valueToFill = profile.degree;
        break;
      case 'yearOfStudy':
        valueToFill = profile.yearOfStudy;
        break;
      case 'passingYear':
        valueToFill = profile.passingYear;
        break;
      case 'cgpa':
        valueToFill = profile.cgpa;
        break;
      case 'preferredPractice':
        valueToFill = profile.preferredPractice;
        break;
      case 'preferredLocation':
        valueToFill = profile.preferredLocation;
        break;
      case 'availability':
        valueToFill = profile.availability;
        break;
      case 'linkedIn':
        valueToFill = profile.linkedIn;
        break;
      case 'coverLetter':
        valueToFill = profile.coverLetterTemplate
          .replace(/{full_name}/g, profile.fullName || '')
          .replace(/{email}/g, profile.email || '')
          .replace(/{phone}/g, profile.phone || '')
          .replace(/{college}/g, profile.college || '')
          .replace(/{degree}/g, profile.degree || '')
          .replace(/{year}/g, profile.yearOfStudy || '')
          .replace(/{cgpa}/g, profile.cgpa || '')
          .replace(/{practice_area}/g, profile.preferredPractice || '')
          .replace(/{location}/g, profile.preferredLocation || '')
          .replace(/{availability}/g, profile.availability || '')
          .replace(/{firm_name}/g, document.title || 'Your Law Firm');
        break;
      case 'achievements':
        valueToFill = profile.achievements;
        break;
    }

    if (valueToFill) {
      if (input.tagName.toLowerCase() === 'select') {
        // Try matching options
        let matched = false;
        Array.from(input.options).forEach(opt => {
          if (valueToFill.toLowerCase().includes(opt.text.toLowerCase()) || opt.text.toLowerCase().includes(valueToFill.toLowerCase())) {
            input.value = opt.value;
            triggerInputEvents(input, opt.value);
            matched = true;
          }
        });
        if (matched) filledCount++;
      } else {
        triggerInputEvents(input, valueToFill);
        filledCount++;
      }
    }
  });

  return filledCount;
}

// Listen for commands from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUTOFILL') {
    const count = autofillForm(request.profile);
    sendResponse({ success: true, count });
  }
  return true;
});
