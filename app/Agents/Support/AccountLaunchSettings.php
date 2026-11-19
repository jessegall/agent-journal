<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\LaunchRefused;

/**
 * The account settings of one start as the program's adapter fills them in; Agents knows no program. A start whose
 * program nobody prepared is refused before its claim.
 */
final class AccountLaunchSettings
{
    /**
     * @var list<LaunchSetting>
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
    private array $launchFlags = [];

    /**
     * @var list<LaunchSetting>
     */
    private array $accountSettings = [];

    private string|null $build = null;

    private string $binaryDigest = '';

    private string $arrangement = '';

    private string $protectionSettings = '';

    public function setVariable(string $name, string $value): void
    {
        $this->environment[] = new LaunchSetting($name, $value);
    }

    public function pointAtEmptyFolder(string $name): void
    {
        $this->emptyFolderVariables[] = $name;
    }

    public function removeVariable(string $name): void
    {
        $this->removedVariables[] = $name;
    }

    public function passFlag(string $flag): void
    {
        $this->launchFlags[] = $flag;
    }

    public function keepAccountSetting(string $name, string $value): void
    {
        $this->accountSettings[] = new LaunchSetting($name, $value);
    }

    /**
     * The program's private protection settings, which the host writes into a file of this launch alone.
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
     * @throws LaunchRefused
     */
    public function recipeFor(string $program): AccountLaunchRecipe
    {
        if ($this->build === null) {
            throw LaunchRefused::withoutAccountSettings($program);
        }

        return new AccountLaunchRecipe(
            $this->environment,
            $this->emptyFolderVariables,
            $this->removedVariables,
            $this->launchFlags,
            $this->accountSettings,
            $this->build,
            $this->binaryDigest,
            $this->arrangement,
            $this->protectionSettings,
        );
    }
}
