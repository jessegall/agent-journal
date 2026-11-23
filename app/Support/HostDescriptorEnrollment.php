<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\DriverCatalogue;
use App\Exceptions\HostDescriptorRepeated;
use App\Models\Drivers\DriverApproval;
use App\Values\DriverRegistration;
use App\Values\EnrolledDescriptor;
use App\Values\HostDescriptor;

/**
 * Matches the drivers a host advertises against the journal's catalogue: an unknown key or an unapproved build is
 * enrolled unavailable with its reason, while the others stay selectable; a key advertised
 * twice refuses the whole report.
 */
final readonly class HostDescriptorEnrollment
{
    public const string UNKNOWN_DRIVER = 'This journal has no driver registered under that key.';

    public const string BUILD_UNAPPROVED = 'The host runs a build of this driver the journal has not approved.';

    public const string REGISTRATION_UNAPPROVED = 'The owner has not approved this third-party driver yet.';

    public function __construct(private DriverCatalogue $drivers) {}

    /**
     * @param  list<HostDescriptor>  $descriptors
     * @return list<EnrolledDescriptor>
     *
     * @throws HostDescriptorRepeated
     */
    public function enroll(array $descriptors): array
    {
        $registrations = [];

        foreach ($this->drivers->catalogue() as $registration) {
            $registrations[(string) $registration->key] = $registration;
        }

        $approvals = DriverApproval::buildsByKey(array_keys($registrations));

        $seen = [];
        $enrolled = [];

        foreach ($descriptors as $descriptor) {
            $key = (string) $descriptor->key;

            if (isset($seen[$key])) {
                throw HostDescriptorRepeated::for($key);
            }

            $seen[$key] = true;
            $enrolled[] = $this->enrolledOf($descriptor, $registrations[$key] ?? null, $approvals);
        }

        return $enrolled;
    }

    /**
     * @param  array<string, list<string>>  $approvals  the approved builds of each approved third-party driver
     */
    private function enrolledOf(
        HostDescriptor $descriptor,
        DriverRegistration|null $registration,
        array $approvals,
    ): EnrolledDescriptor {
        if ($registration === null) {
            return EnrolledDescriptor::unavailable($descriptor, self::UNKNOWN_DRIVER, null);
        }

        $key = (string) $registration->key;

        if ($registration->key->isThirdParty() && ! array_key_exists($key, $approvals)) {
            return EnrolledDescriptor::unavailable($descriptor, self::REGISTRATION_UNAPPROVED, $registration);
        }

        $builds = $approvals[$key] ?? $registration->buildPins;

        if ($builds !== [] && ! in_array($descriptor->build, $builds, true)) {
            return EnrolledDescriptor::unavailable($descriptor, self::BUILD_UNAPPROVED, $registration);
        }

        return EnrolledDescriptor::available($descriptor, $registration);
    }
}
