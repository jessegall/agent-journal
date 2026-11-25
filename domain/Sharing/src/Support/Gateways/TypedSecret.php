<?php

declare(strict_types=1);

namespace Domain\Sharing\Support\Gateways;


/**
 * One secret field of the owner's gateway form: the secret's name and what the owner typed, empty when the field was
 * left blank to keep the stored secret.
 */
final readonly class TypedSecret
{
    public function __construct(
        public string $name,
        public string $secretText,
    ) {}

    /**
     * Keeps what the owner typed under the secret's name; a blank field leaves the stored secret as it is.
     */
    public function storeIn(GatewaySecrets $secrets): void
    {
        if ($this->secretText === '') {
            return;
        }

        $secrets->store($this->name, $this->secretText);
    }
}
