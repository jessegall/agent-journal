<?php

declare(strict_types=1);

namespace App\Hosts;

/**
 * What the journal refuses in a built driver image's history, as build.sh's check_no_credentials refuses it in the
 * agent image: a layer that sets a token, secret or password, or names a credentials file.
 */
final readonly class DriverImageJudgement
{
    private const string CREDENTIAL = '/(token|secret|password)[a-z_]*=|auth\.json|\.credentials\.json/i';

    /**
     * The first layer of the history that names a credential, if one does.
     *
     * @param  list<string>  $history  the created_by of each layer
     */
    public function credentialIn(array $history): string|null
    {
        foreach ($history as $layer) {
            if (preg_match(self::CREDENTIAL, $layer) === 1) {
                return $layer;
            }
        }

        return null;
    }
}
