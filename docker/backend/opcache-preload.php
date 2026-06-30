<?php

declare(strict_types=1);

$base = '/var/www/html';

require $base . '/vendor/autoload.php';

$dirs = [
    $base . '/vendor/laravel/framework/src/Illuminate',
    $base . '/app',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        continue;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            try {
                opcache_compile_file($file->getRealPath());
            } catch (\Throwable) {
            }
        }
    }
}
