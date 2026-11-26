<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

/**
 * Whether a host name resolves only to public addresses, so a probe never reaches a private or reserved network.
 */
class PublicAddresses
{
    public function isPublic(string $host): bool
    {
        $addresses = gethostbynamel($host);

        if ($addresses === false || $addresses === []) {
            return false;
        }

        foreach ($addresses as $address) {
            if (filter_var(
                $address,
                FILTER_VALIDATE_IP,
                FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE,
            ) === false) {
                return false;
            }
        }

        return true;
    }
}
