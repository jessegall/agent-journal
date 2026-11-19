<?php

declare(strict_types=1);

namespace Tests\Support\Sharing;

use Illuminate\Support\Str;

/**
 * A temporary folder the sharing gateways keep their secrets in, removed after the test.
 */
trait UsesSecretsFolder
{
    private string $secretsFolder;

    protected function setUpUsesSecretsFolder(): void
    {
        $this->secretsFolder = sys_get_temp_dir().'/sharing-secrets-'.Str::lower((string) Str::ulid());
        config(['sharing.secrets_dir' => $this->secretsFolder]);
    }

    protected function tearDownUsesSecretsFolder(): void
    {
        array_map(unlink(...), glob("{$this->secretsFolder}/*") ?: []);

        if (is_dir($this->secretsFolder)) {
            rmdir($this->secretsFolder);
        }
    }
}
