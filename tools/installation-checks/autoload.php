<?php

declare(strict_types=1);

/**
 * Loads the project's packages for a check run from the machine that hosts the installation, whose PHP may be older
 * than the one the app's image runs, so the app's platform check is left out.
 */

use Composer\Autoload\ClassLoader;

$vendor = dirname(__DIR__, 2).'/vendor';

require_once $vendor.'/composer/ClassLoader.php';

$loader = new ClassLoader($vendor);

foreach (require $vendor.'/composer/autoload_psr4.php' as $namespace => $folders) {
    $loader->setPsr4($namespace, $folders);
}

$loader->addClassMap(require $vendor.'/composer/autoload_classmap.php');
$loader->register();

foreach (require $vendor.'/composer/autoload_files.php' as $file) {
    require_once $file;
}
