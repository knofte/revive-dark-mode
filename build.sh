#!/bin/bash
#
# Build the rvDarkMode plugin ZIP for installation in Revive Adserver.
#
# Usage: ./build.sh
# Output: rvDarkMode.zip (ready to upload via Plugins > Install)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build"
ZIP_FILE="${SCRIPT_DIR}/rvDarkMode.zip"

echo "Building rvDarkMode plugin..."

rm -rf "${BUILD_DIR}" "${ZIP_FILE}"
mkdir -p "${BUILD_DIR}"

cp -r "${SCRIPT_DIR}/plugins" "${BUILD_DIR}/"
cp -r "${SCRIPT_DIR}/www" "${BUILD_DIR}/"

cd "${BUILD_DIR}"
zip -r "${ZIP_FILE}" plugins/ www/

rm -rf "${BUILD_DIR}"

echo ""
echo "Built: ${ZIP_FILE}"
echo ""
echo "To install:"
echo "  1. Log in to Revive Adserver as admin"
echo "  2. Go to Plugins > Install"
echo "  3. Upload rvDarkMode.zip"
echo "  4. Enable the plugin"
echo "  5. Look for the moon icon in the header bar"
