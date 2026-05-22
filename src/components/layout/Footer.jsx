import React from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const links = [
    { to: "/", label: t("home") },
    { to: "/about", label: t("aboutUs") },
    { to: "/blog", label: t("blog") },
    { to: "/contact", label: t("contact") },
  ];

  const categories = [
    t("securityCameras"),
    t("cables"),
    t("networking"),
    t("smartHome"),
    t("accessories"),
    t("powerSupplies"),
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">Peiraki</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              {t("yourTrustedSource")}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">{t("quickLinks")}</h4>
            <div className="space-y-2.5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-background/60 hover:text-background transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">{t("categories")}</h4>
            <div className="space-y-2.5">
              {categories.map((cat) => (
                <span key={cat} className="block text-sm text-background/60">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">{t("contactInfo")}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/60">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{t("supportEmail")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/60">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{t("supportPhone")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/60">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{t("supportAddress")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center text-sm text-background/40">
          © {new Date().getFullYear()} Peiraki. {t("allRightsReserved")}
        </div>
      </div>
    </footer>
  );
}