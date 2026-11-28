<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use App\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use App\Sharing\Support\Gateways\GatewaySecrets;
use App\Sharing\Support\Gateways\TypedSecret;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner's gateway settings from the gateway page: the settings the gateway pins, the secrets entered in password
 * fields (a blank one keeps what is stored), whether to make it the default, and the Idempotency-Key header.
 */
final class ConfigureShareGatewayRequest extends FormRequest
{
    use ReadsIdempotencyKey;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->idempotencyKeyRules(),
            'gatewayKey' => [
                'required',
                'string',
                'max:64',
            ],
            'executableVersion' => [
                'required',
                'string',
                'max:64',
            ],
            'providerHost' => [
                'required',
                'string',
                'max:255',
            ],
            'publicOrigin' => [
                'required',
                'string',
                'url:https',
                'max:255',
            ],
            'listenerPort' => [
                'required',
                'integer',
                'min:1',
                'max:65535',
            ],
            'secrets' => [
                'present',
                'array',
                'max:10',
            ],
            'secrets.*.name' => [
                'required',
                'string',
                'regex:/^[a-z0-9_-]+$/',
            ],
            'secrets.*.value' => [
                'nullable',
                'string',
                'max:4096',
            ],
            'makeDefault' => [
                'required',
                'boolean',
            ],
        ];
    }

    /**
     * The gateway's next settings revision, naming its secrets but never carrying them.
     */
    public function command(): ConfigureShareGatewayCommand
    {
        return new ConfigureShareGatewayCommand(
            $this->gatewayKey(),
            $this->executableVersion(),
            $this->providerHost(),
            $this->publicOrigin(),
            $this->listenerPort(),
            $this->secretReferences(),
            $this->shouldMakeDefault(),
            $this->requestKey(),
        );
    }

    public function gatewayKey(): string
    {
        return $this->string('gatewayKey')->toString();
    }

    public function executableVersion(): string
    {
        return $this->string('executableVersion')->toString();
    }

    public function providerHost(): string
    {
        return $this->string('providerHost')->toString();
    }

    public function publicOrigin(): string
    {
        return $this->string('publicOrigin')->toString();
    }

    public function listenerPort(): int
    {
        return $this->integer('listenerPort');
    }

    public function shouldMakeDefault(): bool
    {
        return $this->boolean('makeDefault');
    }

    /**
     * The names of the secrets the gateway reads.
     *
     * @return list<string>
     */
    public function secretReferences(): array
    {
        return array_map(fn (TypedSecret $secret) => $secret->name, $this->typedSecrets());
    }

    /**
     * Keeps every secret the owner typed; a blank field keeps the one already stored.
     */
    public function storeTypedSecrets(GatewaySecrets $secrets): void
    {
        foreach ($this->typedSecrets() as $secret) {
            $secret->storeIn($secrets);
        }
    }

    /**
     * The validated secret fields, each a name and the typed value or an empty one.
     *
     * @return list<TypedSecret>
     */
    private function typedSecrets(): array
    {
        return array_map(
            fn (int|string $index) => new TypedSecret(
                $this->string("secrets.{$index}.name")->toString(),
                $this->string("secrets.{$index}.value")->toString(),
            ),
            array_keys($this->array('secrets')),
        );
    }
}
