<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Exceptions\StartRefused;
use App\Sessions\Enums\TransportProfileType;

/**
 * The account settings of one start as the driver's adapter fills them in; Agents knows no driver. A start whose
 * driver nobody prepared is refused before its claim.
 */
final class AccountStartSettings
{
    /**
     * @var list<StartSetting>
     */
    private array $environment = [];

    /**
     * @var list<string>
     */
    private array $emptyFolderVariables = [];

    /**
     * @var list<string>
     */
    private array $removedVariables = [];

    /**
     * @var list<string>
     */
    private array $startFlags = [];

    /**
     * @var list<StartSetting>
     */
    private array $accountSettings = [];

    /**
     * @var list<string>
     */
    private array $readFiles = [];

    private string|null $build = null;

    private string $binaryDigest = '';

    private string $arrangement = '';

    private string $protectionSettings = '';

    private string|null $signInMethod = null;

    public function setVariable(string $name, string $variableText): void
    {
        $this->environment[] = new StartSetting($name, $variableText);
    }

    public function setEmptyFolderVariable(string $name): void
    {
        $this->emptyFolderVariables[] = $name;
    }

    public function removeVariable(string $name): void
    {
        $this->removedVariables[] = $name;
    }

    public function passFlag(string $flag): void
    {
        $this->startFlags[] = $flag;
    }

    public function keepAccountSetting(string $name, string $variableText): void
    {
        $this->accountSettings[] = new StartSetting($name, $variableText);
    }

    /**
     * A file the host opens for the driver to read, such as a token it reads on a descriptor instead of from its
     * environment; answers the descriptor it gets, 3 for the first.
     */
    public function openForReading(string $path): int
    {
        $this->readFiles[] = $path;

        return 2 + count($this->readFiles);
    }

    /**
     * The driver's private protection settings, which the host writes into a file of this start alone.
     */
    public function protectWith(string $settings): void
    {
        $this->protectionSettings = $settings;
    }

    public function holdFor(string $version, string $binaryDigest, string $arrangement): void
    {
        $this->build = $version;
        $this->binaryDigest = $binaryDigest;
        $this->arrangement = $arrangement;
    }

    /**
     * The method the start's saved account signed in by, such as oauth or api_key, which the host's usage reader
     * follows.
     */
    public function signInBy(string $method): void
    {
        $this->signInMethod = $method;
    }

    /**
     * @throws StartRefused
     */
    public function signInMethod(string $driver): string
    {
        if ($this->signInMethod === null) {
            throw StartRefused::withoutSignInMethod($driver);
        }

        return $this->signInMethod;
    }

    /**
     * @throws StartRefused
     */
    public function recipeFor(string $driver, TransportProfileType $transport): AccountStartRecipe
    {
        if ($this->build === null) {
            throw StartRefused::withoutAccountSettings($driver);
        }

        return new AccountStartRecipe(
            $this->environment,
            $this->emptyFolderVariables,
            $this->removedVariables,
            $this->startFlags,
            $this->accountSettings,
            $this->build,
            $this->binaryDigest,
            $this->arrangement,
            $this->protectionSettings,
            $transport,
            $this->readFiles,
        );
    }
}
