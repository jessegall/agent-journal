<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\DriverCatalogue;
use App\Exceptions\HostDescriptorRepeated;
use App\Values\DriverRegistration;
use App\Values\EnrolledDescriptor;
use App\Values\HostDescriptor;

/**
 * Matches the drivers a host advertises against the journal's catalogue: an unknown key, an incompatible protocol or
 * an unapproved build is enrolled unavailable with its reason, while the others stay selectable; a key advertised
 * twice refuses the whole report.
 */
final readonly class HostDescriptorEnrollment
{
    public const string UNKNOWN_DRIVER = 'This journal has no driver registered under that key.';

    public const string PROTOCOL_INCOMPATIBLE = 'The host speaks another version of this driver\'s protocol.';

    public const string BUILD_UNAPPROVED = 'The host runs a build of this driver the journal has not approved.';

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

        $seen = [];
        $enrolled = [];

        foreach ($descriptors as $descriptor) {
            $key = (string) $descriptor->key;

            if (isset($seen[$key])) {
                throw HostDescriptorRepeated::for($key);
            }

            $seen[$key] = true;
            $enrolled[] = $this->enrolledOf($descriptor, $registrations[$key] ?? null);
        }

        return $enrolled;
    }

    private function enrolledOf(HostDescriptor $descriptor, DriverRegistration|null $registration): EnrolledDescriptor
    {
        if ($registration === null) {
            return EnrolledDescriptor::unavailable($descriptor, self::UNKNOWN_DRIVER, null);
        }

        if ($registration->protocolVersion !== $descriptor->protocolVersion) {
            return EnrolledDescriptor::unavailable($descriptor, self::PROTOCOL_INCOMPATIBLE, $registration);
        }

        if ($registration->buildPins !== [] && ! in_array($descriptor->build, $registration->buildPins, true)) {
            return EnrolledDescriptor::unavailable($descriptor, self::BUILD_UNAPPROVED, $registration);
        }

        return EnrolledDescriptor::available($descriptor, $registration);
    }
}
